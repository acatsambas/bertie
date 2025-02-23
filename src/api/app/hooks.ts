import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';

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

export const useUserBooks = ({ withRefs }: { withRefs?: boolean } = {}) => {
  const [userBooks, setUserBooks] = useState<
    UserBook[] | (UserBook & BookResult)[]
  >([]);

  useEffect(
    () =>
      firestore()
        ?.collection('users')
        ?.doc(auth().currentUser?.uid)
        ?.collection('books')
        .onSnapshot(async snapshot => {
          setUserBooks(
            await Promise.all(
              snapshot.docs
                .map(book => ({
                  id: book.id,
                  ...(book.data() as UserBook),
                }))
                .map(async book => ({
                  ...book,
                  ...(withRefs
                    ? ((await book.bookRef.get()).data() as any)
                    : {}),
                })),
            ),
          );
        }),
    [withRefs],
  );

  return userBooks as (UserBook & BookResult)[];
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
