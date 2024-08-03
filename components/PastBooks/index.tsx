import { View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { makeStyles } from "@rneui/themed";

import { LibraryNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import Text from "../Text";
import Book from "../Book";

export interface LibraryPageProps
  extends StackNavigationProp<LibraryNavigatorParamList, "Library"> {}

const PastBooks = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<LibraryPageProps>();

  const handleBook = (bookName: string, author: string) => {
    navigate("Book", { bookName: bookName, author: author });
  };

  const handlePress = () => {
    navigate("Search");
  };

  return (
    <View style={styles.container}>
      <Text text={t(translations.library.past)} kind="header" />

      <View>
        <Book
          title="Infinite Jest"
          author="David Foster Wallance"
          kind="library"
          isChecked={true}
          onPress={() => handleBook("Infinite Jest", "David Foster Wallance")}
        />
        <Book
          title="A Gentleman in Moscow"
          author="Armor Towles"
          kind="library"
          isChecked={true}
        />
        <Book
          title="The Blind Assassin"
          author="Margaret Atwood"
          kind="library"
          isChecked={true}
        />
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

export default PastBooks;
