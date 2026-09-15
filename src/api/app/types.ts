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
  /**
   * When the book went on the list, and when it was ticked as read (cleared
   * if it's unticked). Stored as Firestore timestamps; useUserBooksQuery
   * hands them out as epoch ms. Absent on books from before they were tracked.
   */
  addedAt?: number;
  readAt?: number;
};

export type UserBookId = Pick<UserBook, 'id'>;

export type OrderBook = {
  id: string;
  title?: string;
  authors?: string[];
};

export type Order = {
  id: string;
  status: string;
  /** Absent on orders placed before the field was introduced. */
  createdAt?: { seconds: number };
  shopName?: string;
  books: OrderBook[];
};
