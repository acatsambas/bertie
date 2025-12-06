import { DocumentData, DocumentReference } from 'firebase/firestore';

export type Shop = {
  id: string;
  address: string;
  city: string;
  country: string;
  description: string;
  email: string;
  name: string;
  zipcode: string;
};

export type UserShop = {
  id: string;
  shopRef: DocumentReference<DocumentData>;
};

export type UserBook = {
  id: string;
  bookRef: DocumentReference<DocumentData>;
  isRead?: boolean;
};

export type UserBookId = Pick<UserBook, 'id'>;
