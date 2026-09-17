import { useMutation, useQueryClient } from '@tanstack/react-query';

import { auth } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import { setGuestRating } from 'api/guest/guestStore';
import { warmBookInsights } from 'api/app/book/cacheBookInsights';
import { bookQueryKeys } from 'api/app/book/queryKeys';
import { writeRatingWithStats } from 'api/app/book/ratingStats';
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
            /** null takes the rating off: tapping the one you gave clears it. */
            rating: RatingValue | null;
            book?: BookResult;
        }) => {
            if (isGuest) {
                // Kept local until they have an account: a throwaway session
                // should not move the median every visitor sees.
                await setGuestRating(bookId, rating);
                return;
            }

            if (!userId) throw new Error('User not authenticated');

            // Seeds the shared book document if it is missing, and moves the
            // book's rating tally — which is what Discover reads — in the same
            // transaction as the rating itself.
            await writeRatingWithStats({ bookId, userId, rating, book });

            if (rating === null) return;

            // Get it ready for Insights while the reader carries on.
            void warmBookInsights(bookId);
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
                // Only this reader's own vote moves: swap the one copy of it
                // in the median, drop it, or add a new one.
                queryClient.setQueryData(
                    ['bookRatings', bookId],
                    (old: RatingValue[] = []) => {
                        const mine =
                            previousUserRating == null
                                ? -1
                                : old.indexOf(previousUserRating);

                        if (mine === -1) {
                            return rating === null ? old : [...old, rating];
                        }

                        const next = [...old];
                        if (rating === null) next.splice(mine, 1);
                        else next[mine] = rating;
                        return next;
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
            void queryClient.invalidateQueries({
                queryKey: ['readingInsights'],
            });
        },
    });
};
