import { View } from 'react-native';

import { makeStyles } from '@rneui/themed';

import { BookType } from '../../api/app/types';
import Book from '../Book';

interface OrderBooksListProps {
  books: BookType[];
  setBooks: React.Dispatch<React.SetStateAction<any[]>>;
}

const OrderBooksList = ({ books, setBooks }: OrderBooksListProps) => {
  const handleRemoveBook = (id: string) => {
    const element = books.find(book => book.id === id); //find element
    const index = books.indexOf(element); //find its index
    books.splice(index, 1); //remove element
  };

  const styles = useStyles();
  return (
    <View style={styles.container}>
      {books.map(
        book =>
          book.isRead === false && (
            <Book
              key={book.id}
              title={book.title}
              author={book.author}
              kind="order"
              isChecked={book.isRead}
              onChange={() => handleRemoveBook(book.id)}
            />
          ),
      )}
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: { gap: 10 },
}));

export default OrderBooksList;
