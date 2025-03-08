import { useEffect, useState } from 'react';

import { useUserBooks } from 'api/app/hooks';

import { executeGPT } from 'gpt/discover-books';

export const useBooksTab = ({
  userInput,
  cleanInput,
}: {
  userInput: string;
  cleanInput: () => void;
}) => {
  const books = useUserBooks({ withRefs: true });

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const bookTitles = books.map(book => book.volumeInfo.title);
    async function fetchInitialMessage() {
      const initialMessage = await executeGPT(null, bookTitles); // Get first AI response
      setMessages([initialMessage]);
    }
    fetchInitialMessage();
  }, [books]);

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
