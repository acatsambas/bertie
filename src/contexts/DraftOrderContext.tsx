import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface DraftOrderContextType {
  bookIds: string[];
  count: number;
  toggleBook: (bookId: string) => void;
  clear: () => void;
}

const DraftOrderContext = createContext<DraftOrderContextType | undefined>(
  undefined,
);

export const DraftOrderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [bookIds, setBookIds] = useState<string[]>([]);

  const toggleBook = useCallback((bookId: string) => {
    setBookIds(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      }
      return [...prev, bookId];
    });
  }, []);

  const clear = useCallback(() => {
    setBookIds([]);
  }, []);

  const value = useMemo(
    () => ({
      bookIds,
      count: bookIds.length,
      toggleBook,
      clear,
    }),
    [bookIds, toggleBook, clear],
  );

  return (
    <DraftOrderContext.Provider value={value}>
      {children}
    </DraftOrderContext.Provider>
  );
};

export const useDraftOrder = () => {
  const context = useContext(DraftOrderContext);
  if (!context) {
    throw new Error('useDraftOrder must be used within a DraftOrderProvider');
  }
  return context;
};
