import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import { setGuestRating } from 'api/guest/guestStore';
import { bookQueryKeys } from 'api/app/book/queryKeys';
import { BookResult } from 'api/google-books/search';

export type RatingValue = 1 | 2 | 3 | 4;

export const useRateBookMutation = () => {
    const queryClient = useQueryClient();
    const { isGuest } = useGuest();
    const userId = auth.currentUser?.uid;

    return useMutation({
        mutationFn: async ({
            bookId,
            rating,
            book,
        }: {
            bookId: string;
            rating: RatingValue;
            book?: BookResult;
        }) => {
            if (isGuest) {
                // Kept local until they have an account: a throwaway session
                // should not move the median every visitor sees.
                await setGuestRating(bookId, rating);
                return;
            }

            if (!userId) throw new Error('User not authenticated');

            // Ensure the book exists in the books collection
            if (book) {
                const bookRef = doc(db, 'books', bookId);
                const bookDoc = await getDoc(bookRef);
                if (!bookDoc.exists()) {
                    await setDoc(bookRef, book);
                }
            }

            const ratingRef = doc(db, 'ratings', `${bookId}_${userId}`);
            await setDoc(ratingRef, { bookId, userId, rating });
        },
        onMutate: async ({ bookId, rating }) => {
            await queryClient.cancelQueries({
                queryKey: ['userBookRating', bookId],
            });
            await queryClient.cancelQueries({ queryKey: ['bookRatings', bookId] });

            const previousUserRating =
                queryClient.getQueryData<RatingValue | null>(
                    bookQueryKeys.userBookRating(bookId, isGuest),
                );
            const previousBookRatings = queryClient.getQueryData([
                'bookRatings',
                bookId,
            ]);

            queryClient.setQueryData(
                bookQueryKeys.userBookRating(bookId, isGuest),
                rating,
            );

            if (!isGuest) {
                queryClient.setQueryData(
                    ['bookRatings', bookId],
                    (old: RatingValue[] = []) => {
                        if (previousUserRating != null) {
                            return old.map(r =>
                                r === previousUserRating ? rating : r,
                            );
                        }
                        return [...old, rating];
                    },
                );
            }

            return { previousUserRating, previousBookRatings };
        },
        onError: (_, { bookId }, context) => {
            if (context?.previousUserRating !== undefined) {
                queryClient.setQueryData(
                    bookQueryKeys.userBookRating(bookId, isGuest),
                    context.previousUserRating,
                );
            }
            if (context?.previousBookRatings !== undefined) {
                queryClient.setQueryData(
                    ['bookRatings', bookId],
                    context.previousBookRatings,
                );
            }
        },
        onSettled: (_, __, { bookId }) => {
            void queryClient.invalidateQueries({
                queryKey: ['userBookRating', bookId],
            });
            void queryClient.invalidateQueries({
                queryKey: ['bookRatings', bookId],
            });
        },
    });
};
