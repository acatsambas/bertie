import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import { BookResult } from '../google-books/search';
import { UserData } from '../types';
import { Shop, UserBook, UserShop } from './types';

export const useShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(
    () =>
      firestore()
        ?.collection('shops')
        .onSnapshot(snapshot => {
          setShops(
            snapshot.docs.map(
              doc =>
                ({
                  id: doc.id,
                  ...doc.data(),
                }) as Shop,
            ),
          );
        }),
    [],
  );

  return shops;
};

export const useFavouriteShops = () => {
  const [favouriteShops, setFavouriteShops] = useState<UserShop[]>([]);

  useEffect(
    () =>
      firestore()
        ?.collection('users')
        ?.doc(auth().currentUser?.uid)
        ?.collection('favouriteShops')
        .onSnapshot(snapshot => {
          setFavouriteShops(
            snapshot.docs.map(
              doc =>
                ({
                  id: doc.id,
                  ...doc.data(),
                }) as (typeof favouriteShops)[number],
            ),
          );
        }),
    [],
  );

  return favouriteShops;
};

export const useUser = () => {
  const [user, setUser] = useState<UserData | undefined>();

  useEffect(
    () =>
      firestore()
        ?.collection('users')
        .doc(auth().currentUser?.uid)
        .onSnapshot(snapshot => {
          setUser(snapshot.data() as UserData);
        }),
    [],
  );

  return user;
};

const SNAPSHOT_LENGTH = 15;

export const useUserBooks = ({ withRefs }: { withRefs?: boolean } = {}) => {
  const [userBooks, setUserBooks] = useState<(UserBook & BookResult)[]>([]);
  const [lastDoc, setLastDoc] =
    useState<FirebaseFirestoreTypes.QueryDocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchUserBooks = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const userId = auth().currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      let query = firestore()
        .collection('users')
        .doc(userId)
        .collection('books')
        .limit(SNAPSHOT_LENGTH);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();

      if (snapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const books = await Promise.all(
        snapshot.docs.map(async book => {
          const bookData = book.data() as UserBook;
          if (withRefs && bookData.bookRef) {
            const refData = (await bookData.bookRef.get()).data() as BookResult;
            return { ...bookData, ...refData };
          }
          return bookData;
        }),
      );

      setUserBooks(prevBooks => [...prevBooks, ...books]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === SNAPSHOT_LENGTH);
    } catch (error) {
      console.error('Error fetching user books:', error);
    } finally {
      setLoading(false);
    }
  }, [lastDoc, loading, hasMore, withRefs]);

  useEffect(() => {
    void fetchUserBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { userBooks, fetchUserBooks, loading, hasMore };
};

export const useBooks = ({ ids }: { ids: string[] } = { ids: [] }) => {
  const [books, setBooks] = useState<BookResult[]>([]);

  useEffect(
    () =>
      firestore()
        ?.collection('books')
        .where(firestore.FieldPath.documentId(), 'in', ids)
        .onSnapshot(snapshot => {
          setBooks(
            snapshot.docs.map(
              doc =>
                ({
                  id: doc.id,
                  ...doc.data(),
                }) as BookResult,
            ),
          );
        }),
    [ids],
  );

  return books;
};
