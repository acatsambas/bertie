import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from 'api/firebase';
import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';

export const useBookRatingsQuery = (bookId: string) => {
    return useQuery<RatingValue[]>({
        queryKey: ['bookRatings', bookId],
        queryFn: async () => {
            const ratingsQuery = query(
                collection(db, 'ratings'),
                where('bookId', '==', bookId),
            );
            const snapshot = await getDocs(ratingsQuery);
            return snapshot.docs.map(doc => doc.data().rating as RatingValue);
        },
        enabled: !!bookId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
};
