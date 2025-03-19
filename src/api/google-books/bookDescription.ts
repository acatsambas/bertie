export interface BookResult {
  volumeInfo?: {
    description: string;
  };
}

export const bookDescription = async (id: string) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${id}?fields=volumeInfo/description`,
  );

  const json = (await response.json()) as BookResult;

  return json.volumeInfo.description;
};
