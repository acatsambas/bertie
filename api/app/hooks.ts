import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const fetchUserBooks = async () => {
  const userBooksSnapshot = await firestore()
    ?.collection('users')
    ?.doc(auth().currentUser?.uid)
    ?.collection('books')
    .get();
  const booksList = userBooksSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return booksList;
};

export const fetchBookshops = async () => {
  try {
    const bookShopsSnapshot = await firestore()?.collection('shops').get();
    const bookShopsList = bookShopsSnapshot?.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return bookShopsList;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserBookShops = async () => {
  const shopsSnapshot = await firestore()
    ?.collection('users')
    ?.doc(auth().currentUser?.uid)
    ?.collection('bookstores')
    .get();
  const bookShopsList = shopsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return bookShopsList;
};

export const fetchUserAddress = async () => {
  const usrSnapshop = await firestore()
    ?.collection('Address')
    ?.doc(auth().currentUser?.uid)
    .get();

  return usrSnapshop;
};

export const updateBookRead = (bookId: string, isRead: boolean) => {
  return firestore()
    .collection('users')
    .doc(auth().currentUser?.uid)
    .collection('books')
    .doc(bookId)
    .set(
      {
        isRead: !isRead,
      },
      { merge: true },
    );
};

export const pickFavoriteShop = (shopId: string) => {
  return firestore()?.collection('users')?.doc(auth().currentUser?.uid)?.set(
    {
      pickedShopId: shopId,
    },
    { merge: true },
  );
};

export const getPickedFavoriteShop = async () => {
  const userDoc = await firestore()
    ?.collection('users')
    ?.doc(auth().currentUser?.uid)
    ?.get();

  const pickedShopId = userDoc.data()?.pickedShopId;
  return pickedShopId;
};
