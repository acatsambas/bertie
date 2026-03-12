import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';

import { db } from 'api/firebase';
import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';

interface RatingDoc {
    bookId: string;
    rating: RatingValue;
}

const computeMedian = (values: number[]): number => {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }
    return sorted[mid];
};

export const useEssentialBooksQuery = () => {
    return useQuery<string[]>({
        queryKey: ['essentialBooks'],
        queryFn: async () => {
            const snapshot = await getDocs(collection(db, 'ratings'));
            const ratings = snapshot.docs.map(doc => doc.data() as RatingDoc);

            // Group ratings by bookId
            const byBook = new Map<string, RatingValue[]>();
            for (const { bookId, rating } of ratings) {
                const existing = byBook.get(bookId) || [];
                existing.push(rating);
                byBook.set(bookId, existing);
            }

            // Find books with median rating of 4
            const essentialBookIds: string[] = [];
            for (const [bookId, bookRatings] of byBook) {
                if (computeMedian(bookRatings) === 4) {
                    essentialBookIds.push(bookId);
                }
                if (essentialBookIds.length >= 10) break;
            }

            return essentialBookIds;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
};
