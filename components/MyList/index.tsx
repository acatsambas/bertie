import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

import { makeStyles } from "@rneui/themed";

import { translations } from "../../locales/translations";
import Text from "../Text";
import Book from "../Book";

const MyList = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const handleBook = (bookName: string) => {};

  return (
    <View>
      <Text text={t(translations.library.current)} kind="header" />
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

const useStyles = makeStyles(() => ({}));

export default MyList;
