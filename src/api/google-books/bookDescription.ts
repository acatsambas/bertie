export interface BookResult {
  volumeInfo?: {
    description: string;
  };
}

export const bookDescription = async (
  id: string,
): Promise<string | null> => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${id}?fields=volumeInfo/description&key=${process.env.EXPO_PUBLIC_BOOKS_API_KEY}`,
  );

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as BookResult;

  return json.volumeInfo?.description ?? null;
};
