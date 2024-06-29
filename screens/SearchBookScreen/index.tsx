import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { makeStyles } from "@rneui/themed";

import { LibraryNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import BottomMenu from "../../components/BottomMenu";
import Text from "../../components/Text";
import Icon from "../../components/Icon";
import Input from "../../components/Input";
import SearchBooks from "../../components/SearchBooks";

export interface SearchBookProps
  extends StackNavigationProp<LibraryNavigatorParamList, "Search"> {}

const SearchBookScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<SearchBookProps>();

  const handleCloseClick = () => {
    navigate("Library");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text text={t(translations.library.search.title)} kind="bigHeader" />
          <Icon icon="x" onPress={handleCloseClick} />
        </View>
        <Input placeholder="What are you looking for today?" kind="search" />
        <Text
          kind="paragraph"
          text={t(translations.library.search.addToList)}
        />
        <SearchBooks />
      </View>
      <View style={styles.bottomArea}>
        <BottomMenu />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  container: { paddingTop: 20, gap: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
}));

export default SearchBookScreen;
