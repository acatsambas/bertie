import { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import firestore from "@react-native-firebase/firestore";

import { makeStyles } from "@rneui/themed";

import { LibraryNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import { AuthContext } from "../../api/auth/AuthProvider";
import Text from "../Text";
import Book from "../Book";
import Icon from "../Icon";

export interface LibraryPageProps
  extends StackNavigationProp<LibraryNavigatorParamList, "Library"> {}

const CurrentBooks = () => {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    fetchBooks();
  }, [books]);

  const fetchBooks = async () => {
    const userBooksSnapshot = await firestore()
      .collection("users")
      .doc(userId)
      .collection("books")
      .get();

    const booksList = userBooksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(booksList);
  };
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<LibraryPageProps>();

  const { user } = useContext(AuthContext);
  const userId = user.uid;

  const handleBook = (bookName: string, author: string, isMyList: boolean) => {
    navigate("Book", {
      bookName: bookName,
      author: author,
      isMyList: isMyList,
    });
  };

  const handleRead = async (bookId: string, isRead: boolean) => {
    try {
      await firestore()
        .collection("users")
        .doc(userId)
        .collection("books")
        .doc(bookId)
        .set(
          {
            isRead: !isRead,
          },
          { merge: true }
        );
    } catch (error) {
      console.log(error);
    }
  };

  const handlePress = () => {
    navigate("Search");
  };

  return (
    <View style={styles.container}>
      <Text text={t(translations.library.current)} kind="header" />

      <TouchableOpacity style={styles.text} onPress={handlePress}>
        <Icon icon="plus" color="grey" />
        <Text
          kind="paragraph"
          text={t(translations.library.searchTitle)}
          color="grey"
        />
      </TouchableOpacity>

      <View>
        {books.map(
          (book) =>
            book.isRead === false && (
              <Book
                key={book.id}
                title={book.title}
                author={book.author}
                kind="library"
                isChecked={book.isRead}
                onPress={() => handleBook(book.title, book.author, true)}
                onChange={() => handleRead(book.id, book.isRead)}
              />
            )
        )}
      </View>
    </View>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    gap: 20,
  },
  text: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 17,
    gap: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: "dashed",
    alignItems: "center",
    borderColor: "grey",
  },
}));

export default CurrentBooks;
