import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from 'api/firebase';
import {
  BookInsightsMeta,
  fetchBookInsightsMeta,
} from 'api/google-books/fetchBookInsightsMeta';

/** Keeps a book's genres and first publication year on its shared doc. */
export const saveBookInsights = (bookId: string, meta: BookInsightsMeta) =>
  updateDoc(doc(db, 'books', bookId), { insights: meta });

/**
 * Looks a book up for Insights ahead of time — when it's ticked as read or
 * rated — so the Insights tab finds it ready. Quietly does nothing if it's
 * already cached, has no shared document, or the lookup fails: Insights
 * will try again itself.
 */
export const warmBookInsights = async (bookId: string) => {
  try {
    const snapshot = await getDoc(doc(db, 'books', bookId));
    if (!snapshot.exists() || snapshot.data().insights) return;

    const { meta } = await fetchBookInsightsMeta(bookId);
    await saveBookInsights(bookId, meta);
  } catch (error) {
    console.warn('Could not look up book insights:', error);
  }
};
