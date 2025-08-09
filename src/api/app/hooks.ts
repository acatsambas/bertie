import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';

import { UserData } from '../types';
import { Shop, UserShop } from './types';

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
