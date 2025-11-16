// Web version of discover-books - OpenAI is not available on web

// Function to initialize conversation with books
export async function executeGPT(
  userMessage: string | null = null,
  books: string[] | null = null,
) {
  if (books && books.length === 0) {
    return 'Your reading list is empty. Add books to get personalized recommendations!';
  }
  return 'AI recommendations are not available on web. Please use the mobile app for personalized book recommendations.';
}
