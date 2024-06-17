import { View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import Text from "../Text";
import Book from "../Book";
import Icon from "../Icon";

const MyList = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const handleBook = (bookName: string) => {};

  return (
    <View style={styles.container}>
      <Text text={t(translations.library.current)} kind="header" />
      <TouchableOpacity style={styles.text}>
        <Icon icon="plus" color="grey" />
        <Text
          kind="paragraph"
          text={t(translations.library.addBook)}
          color="grey"
        />
      </TouchableOpacity>
      <View>
        <Book
          title="Infinite Jest"
          author="David Foster Wallance"
          kind="library"
          onPress={() => handleBook("Infinite Jest")}
        />
        <Book
          title="A Gentleman in Moscow"
          author="Armor Towles"
          kind="library"
        />
        <Book
          title="The Blind Assassin"
          author="Margaret Atwood"
          kind="library"
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

export default MyList;
