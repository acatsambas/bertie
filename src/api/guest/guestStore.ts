import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';

import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';
import { UserData } from 'api/types';
import { db } from 'api/firebase';
import { BookResult } from 'api/google-books/search';

/**
 * Local store for people exploring without an account.
 *
 * Guests used to be signed in anonymously, which minted a permanent Firebase
 * Auth user and a `users/{uid}` document for anyone who merely looked around.
 * That identity was never shared across devices anyway — it lived in this same
 * local storage — so keeping guest data here costs the guest nothing and keeps
 * Firebase clean until someone actually creates an account.
 *
 * Everything a guest touches lives in one JSON blob under a single key.
 */

const GUEST_DATA_KEY = '@bertie/guest-data';
const GUEST_MODE_KEY = '@bertie/guest-mode';

export interface GuestBook {
  book: BookResult;
  isRead: boolean;
}

export interface GuestData {
  /** keyed by Google Books volume id */
  books: Record<string, GuestBook>;
  /** bookId -> the rating this guest gave it */
  ratings: Record<string, RatingValue>;
  /** shop ids this guest favourited */
  favouriteShops: string[];
  /** the subset of UserData a guest can actually fill in */
  profile: Partial<UserData>;
}

const EMPTY: GuestData = {
  books: {},
  ratings: {},
  favouriteShops: [],
  profile: {},
};

export const readGuestData = async (): Promise<GuestData> => {
  try {
    const raw = await AsyncStorage.getItem(GUEST_DATA_KEY);
    if (!raw) return { ...EMPTY };

    const parsed = JSON.parse(raw) as Partial<GuestData>;

    // Merge against EMPTY so a blob written by an older build, or a partially
    // corrupted one, can never hand callers an undefined collection.
    return {
      books: parsed.books ?? {},
      ratings: parsed.ratings ?? {},
      favouriteShops: parsed.favouriteShops ?? [],
      profile: parsed.profile ?? {},
    };
  } catch (error) {
    console.warn('Could not read guest data, starting empty:', error);
    return { ...EMPTY };
  }
};

const writeGuestData = async (data: GuestData) => {
  try {
    await AsyncStorage.setItem(GUEST_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Could not persist guest data:', error);
  }
};

/** Read-modify-write. Guest writes are user-paced, so races are not a concern. */
const updateGuestData = async (
  change: (data: GuestData) => GuestData,
): Promise<GuestData> => {
  const next = change(await readGuestData());
  await writeGuestData(next);
  return next;
};

export const clearGuestData = async () => {
  try {
    await AsyncStorage.removeItem(GUEST_DATA_KEY);
  } catch (error) {
    console.warn('Could not clear guest data:', error);
  }
};

// --- guest mode flag -------------------------------------------------------

export const readGuestMode = async (): Promise<boolean> => {
  try {
    return (await AsyncStorage.getItem(GUEST_MODE_KEY)) === 'true';
  } catch (error) {
    console.warn('Could not read guest mode flag:', error);
    return false;
  }
};

export const writeGuestMode = async (enabled: boolean) => {
  try {
    if (enabled) {
      await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
    } else {
      await AsyncStorage.removeItem(GUEST_MODE_KEY);
    }
  } catch (error) {
    console.warn('Could not persist guest mode flag:', error);
  }
};

// --- books -----------------------------------------------------------------

export const setGuestBook = (book: BookResult, isUserBook: boolean) =>
  updateGuestData(data => {
    const books = { ...data.books };

    if (isUserBook) {
      delete books[book.id];
    } else {
      books[book.id] = { book, isRead: books[book.id]?.isRead ?? false };
    }

    return { ...data, books };
  });

export const setGuestBookRead = (bookId: string, isRead: boolean) =>
  updateGuestData(data => {
    const existing = data.books[bookId];
    if (!existing) return data;

    return {
      ...data,
      books: { ...data.books, [bookId]: { ...existing, isRead } },
    };
  });

// --- ratings ---------------------------------------------------------------

export const setGuestRating = (bookId: string, rating: RatingValue) =>
  updateGuestData(data => ({
    ...data,
    ratings: { ...data.ratings, [bookId]: rating },
  }));

// --- favourite shops -------------------------------------------------------

export const setGuestFavouriteShop = (shopId: string, isFavourite: boolean) =>
  updateGuestData(data => ({
    ...data,
    favouriteShops: isFavourite
      ? data.favouriteShops.filter(id => id !== shopId)
      : [...data.favouriteShops.filter(id => id !== shopId), shopId],
  }));

// --- profile ---------------------------------------------------------------

export const updateGuestProfile = (profile: Partial<UserData>) =>
  updateGuestData(data => ({
    ...data,
    profile: { ...data.profile, ...profile },
  }));

// --- migration -------------------------------------------------------------

/**
 * Copy everything a guest built up into Firestore under their new account.
 *
 * Called once, right after the first sign-in that follows a guest session.
 * Writes are merge-based so signing in to an *existing* account folds the
 * guest's books into it rather than replacing what is already there.
 */
export const migrateGuestDataToUser = async (
  userId: string,
): Promise<boolean> => {
  const data = await readGuestData();

  const bookIds = Object.keys(data.books);
  const ratingIds = Object.keys(data.ratings);

  if (
    bookIds.length === 0 &&
    ratingIds.length === 0 &&
    data.favouriteShops.length === 0 &&
    Object.keys(data.profile).length === 0
  ) {
    return false;
  }

  // The guest never created the shared `books/{id}` documents, so seed any
  // that are still missing before pointing the user's library at them.
  await Promise.all(
    bookIds.map(async bookId => {
      const { book, isRead } = data.books[bookId];
      const bookRef = doc(db, 'books', bookId);

      await setDoc(bookRef, book, { merge: true });
      await setDoc(
        doc(db, 'users', userId, 'books', bookId),
        { bookRef, isRead },
        { merge: true },
      );
    }),
  );

  await Promise.all(
    ratingIds.map(bookId =>
      setDoc(doc(db, 'ratings', `${bookId}_${userId}`), {
        bookId,
        userId,
        rating: data.ratings[bookId],
      }),
    ),
  );

  await Promise.all(
    data.favouriteShops.map(shopId =>
      setDoc(
        doc(db, 'users', userId, 'favouriteShops', shopId),
        { shopRef: doc(db, 'shops', shopId) },
        { merge: true },
      ),
    ),
  );

  if (Object.keys(data.profile).length > 0) {
    await setDoc(doc(db, 'users', userId), data.profile, { merge: true });
  }

  return true;
};
