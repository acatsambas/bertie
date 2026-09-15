/**
 * Wraps async calls so that at most `limit` run at once, however many
 * callers share it; the rest wait their turn.
 */
export const createLimiter = (limit: number) => {
  let active = 0;
  const queue: (() => void)[] = [];

  const next = () => {
    if (active >= limit) return;
    const run = queue.shift();
    if (!run) return;
    active += 1;
    run();
  };

  return <R>(fn: () => Promise<R>) =>
    new Promise<R>((resolve, reject) => {
      queue.push(() =>
        fn()
          .then(resolve, reject)
          .finally(() => {
            active -= 1;
            next();
          }),
      );
      next();
    });
};

/** `Promise.all` over `items`, but with at most `limit` calls in flight. */
export const mapWithLimit = async <T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
) => {
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return results;
};
