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
  const { params } = useRoute<RouteProp<LibraryNavigatorParamList, "Book">>();
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<BookPageProps>();
  const { bookName, author, isMyList, id } = params;

  const handleBack = () => {
    navigate("Library");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Image />
        <View>
          <Text kind="bigHeader" text={bookName} />
          <Text kind="paragraph" text={author} />
        </View>
        <Text
          kind="description"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        />
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
