/**
 * Query keys shared between a query and the mutations that optimistically
 * update its cache.
 *
 * These carry `isGuest` because guest and signed-in data come from different
 * places. That matters more than it looks: `setQueryData` and `getQueryData`
 * match keys *exactly*, while `invalidateQueries` and `cancelQueries` match on
 * prefix. So a mutation that rebuilds the key by hand keeps working for
 * invalidation while silently writing its optimistic update to a cache entry
 * nothing reads. Both sides build the key from here so they cannot drift.
 */
export const bookQueryKeys = {
  userBooksIds: (isGuest: boolean) => ['userBooksIds', isGuest] as const,
  userBookRating: (bookId: string, isGuest: boolean) =>
    ['userBookRating', bookId, isGuest] as const,
};
