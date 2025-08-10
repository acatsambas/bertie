import { useEffect, useState } from 'react';

import { useUserBooksQuery } from 'api/app/book';

import { executeGPT } from 'gpt/discover-books';

export const useBooksTab = ({
  userInput,
  cleanInput,
}: {
  userInput: string;
  cleanInput: () => void;
}) => {
  const { data } = useUserBooksQuery({ withRefs: true });

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!data?.pages) return;
    const bookTitles = data.pages
      .flatMap(page => page.books)
      .map(book => book.volumeInfo.title);

    async function fetchInitialMessage() {
      const initialMessage = await executeGPT(null, bookTitles); // Get first AI response
      setMessages([initialMessage]);
    }
    fetchInitialMessage();
    // Disabling exhaustive-deps here because we want this to run only once on mount and not on every book load. So we save on tokens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (userInput.trim()) {
      const userMessage = userInput;
      setMessages(prevMessages => [...prevMessages, userMessage]); // Show user message
      cleanInput();

      const botResponse = await executeGPT(userMessage); // Get AI response
      setMessages(prevMessages => [...prevMessages, botResponse]); // Update UI
    }
  };

  return {
    messages,
    handleSendMessage: handleSend,
  };
};
