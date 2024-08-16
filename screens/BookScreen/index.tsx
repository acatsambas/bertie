import { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import { LibraryNavigatorParamList } from "../../navigation/AppStack/params";
import Text from "../../components/Text";
import Image from "../../components/Image";
import Button from "../../components/Button";

export interface BookPageProps
  extends StackNavigationProp<LibraryNavigatorParamList, "Book"> {}

const BookScreen = () => {
  const [description, setDescription] = useState("");
  const [imageCover, setImageCover] = useState("");

  const { params } = useRoute<RouteProp<LibraryNavigatorParamList, "Book">>();
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<BookPageProps>();
  const { bookName, author, isMyList, id } = params;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.EXPO_PUBLIC_BOOKS_API_KEY}`
    );
    const json = await data.json();
    setDescription(json?.volumeInfo?.description);
    setImageCover(json?.volumeInfo?.imageLinks?.medium);
  };

  const handleBack = () => {
    navigate("Library");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Image imgSource={imageCover} />
        <View>
          <Text kind="bigHeader" text={bookName} />
          <Text kind="paragraph" text={author} />
        </View>
        <Text kind="description" text={description} />
        {!isMyList && (
          <Button kind="primary" text={t(translations.library.add)} />
        )}
        <Button
          kind="tertiary"
          text={t(translations.library.back)}
          onPress={handleBack}
        />
      </View>
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
