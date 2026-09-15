/** `items` in runs of at most `size`, e.g. for Firestore's 30-value `in`. */
export const chunk = <T>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, (i + 1) * size),
  );
