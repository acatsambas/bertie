import { View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { makeStyles } from "@rneui/themed";

import { LibraryNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import Text from "../Text";
import Book from "../Book";
import Icon from "../Icon";

interface MyListProps {
  kind?: "current" | "past";
}

export interface LibraryPageProps
  extends StackNavigationProp<LibraryNavigatorParamList, "Library"> {}

const MyList = ({ kind }: MyListProps) => {
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
      <Text
        text={
          kind === "current"
            ? t(translations.library.current)
            : t(translations.library.past)
        }
        kind="header"
      />
      {kind === "current" && (
        <TouchableOpacity style={styles.text} onPress={handlePress}>
          <Icon icon="plus" color="grey" />
          <Text
            kind="paragraph"
            text={t(translations.library.searchTitle)}
            color="grey"
          />
        </TouchableOpacity>
      )}
      <View>
        <Book
          title="Infinite Jest"
          author="David Foster Wallance"
          kind="library"
          isChecked={kind === "past"}
          onPress={() => handleBook("Infinite Jest", "David Foster Wallance")}
        />
        <Book
          title="A Gentleman in Moscow"
          author="Armor Towles"
          kind="library"
          isChecked={kind === "past"}
        />
        <Book
          title="The Blind Assassin"
          author="Margaret Atwood"
          kind="library"
          isChecked={kind === "past"}
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
