import { useEffect, useRef, useState } from 'react';

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
  const hasInitialized = useRef(false); // Tracks if the initial message has been set
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!data?.pages || hasInitialized.current) return;

    const bookTitles = data.pages
      .flatMap(page => page.books)
      .map(book => book.volumeInfo.title);

    async function fetchInitialMessage() {
      hasInitialized.current = true;
      const initialMessage = await executeGPT(null, bookTitles); // Get first AI response
      setMessages([initialMessage]);
    }

    void fetchInitialMessage();
  }, [data?.pages]);

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
