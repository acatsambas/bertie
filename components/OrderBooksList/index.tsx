import { makeStyles } from '@rneui/themed';
import { View } from 'react-native';

import Book from 'components/Book';

import { UserBook } from 'api/app/types';
import { BookResult } from 'api/google-books/search';

interface OrderBooksListProps {
  books: (BookResult & Pick<UserBook, 'isRead'>)[];
  setBooks: React.Dispatch<React.SetStateAction<any[]>>;
}

const OrderBooksList = ({ books, setBooks }: OrderBooksListProps) => {
  const styles = useStyles();

  const handleRemoveBook = (bookId: string) => {
    setBooks(books.filter(book => book.id !== bookId));
  };

  return (
    <View style={styles.container}>
      {books.map(book => (
        <Book
          key={book.id}
          title={book.volumeInfo?.title}
          author={book.volumeInfo?.authors?.join?.(', ')}
          kind="order"
          onChange={() => handleRemoveBook(book.id)}
        />
      ))}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: { gap: 10 },
}));

export default OrderBooksList;
