import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import { readGuestData } from 'api/guest/guestStore';
import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';
import { bookQueryKeys } from 'api/app/book/queryKeys';

export const useUserBookRatingQuery = (bookId: string) => {
    const { isGuest } = useGuest();
    const userId = auth.currentUser?.uid;

    return useQuery<RatingValue | null>({
        queryKey: bookQueryKeys.userBookRating(bookId, isGuest),
        queryFn: async () => {
            if (isGuest) {
                return (await readGuestData()).ratings[bookId] ?? null;
            }

            if (!userId) return null;

            const ratingRef = doc(db, 'ratings', `${bookId}_${userId}`);
            const ratingDoc = await getDoc(ratingRef);

            if (!ratingDoc.exists()) return null;

            return ratingDoc.data().rating as RatingValue;
        },
        enabled: !!bookId && (isGuest || !!userId),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
};
