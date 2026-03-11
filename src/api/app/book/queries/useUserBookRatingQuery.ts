import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';
import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';

export const useUserBookRatingQuery = (bookId: string) => {
    const userId = auth.currentUser?.uid;

    return useQuery<RatingValue | null>({
        queryKey: ['userBookRating', bookId],
        queryFn: async () => {
            if (!userId) return null;

            const ratingRef = doc(db, 'ratings', `${bookId}_${userId}`);
            const ratingDoc = await getDoc(ratingRef);

            if (!ratingDoc.exists()) return null;

            return ratingDoc.data().rating as RatingValue;
        },
        enabled: !!bookId && !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
};
