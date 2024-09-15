import { useContext, useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { View, ScrollView, Platform } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import { LibraryNavigatorParamList } from "../../navigation/AppStack/params";
import { AuthContext } from "../../api/auth/AuthProvider";
import Text from "../../components/Text";
import Button from "../../components/Button";

const BookScreen = ({ navigation }) => {
  const [description, setDescription] = useState("");
  const [myList, setMyList] = useState(false);

  const { params } = useRoute<RouteProp<LibraryNavigatorParamList, "Book">>();
  const styles = useStyles();
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const userId = user.uid;
  const { bookName, author, id } = params;

  useEffect(() => {
    fetchData();
    fetchBookData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.EXPO_PUBLIC_BOOKS_API_KEY}`
    );
    const json = await data.json();

    json?.volumeInfo?.description
      ? setDescription(json?.volumeInfo?.description)
      : setDescription("This edition doesn't have a description yet.");
  };

  const fetchBookData = async () => {
    const bookData = await firestore()
      .collection("users")
      .doc(userId)
      .collection("books")
      .doc(id)
      .get();
    setMyList(bookData.exists);
  };

  const handleAddBook = async (
    author: string,
    id: string,
    bookName: string
  ) => {
    await firestore()
      .collection("users")
      .doc(userId)
      .collection("books")
      .doc(id)
      .set(
        {
          author: author,
          bookId: id,
          isRead: false,
          title: bookName,
        },
        { merge: true }
      );
    fetchBookData();
  };

  const handleRemoveBook = async (id: string) => {
    await firestore()
      .collection("users")
      .doc(userId)
      .collection("books")
      .doc(id)
      .delete();
    fetchBookData();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text kind="bigHeader" text={bookName} />
          <Text kind="paragraph" text={author} />
        </View>
        <Text kind="description" text={description} />
        {!myList ? (
          <>
            <Button
              kind="primary"
              text={t(translations.library.add)}
              onPress={() => handleAddBook(author, id, bookName)}
            />

            <Button
              kind="tertiary"
              text={t(translations.library.back)}
              onPress={handleBack}
            />
          </>
        ) : (
          <>
            <Button
              kind="primary"
              text={t(translations.library.back)}
              onPress={handleBack}
            />

            <Button
              kind="tertiary"
              text={t(translations.library.remove)}
              onPress={() => handleRemoveBook(id)}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FDF9F6",
  },
  container: { paddingTop: 20, gap: 20 },
}));

export default BookScreen;
