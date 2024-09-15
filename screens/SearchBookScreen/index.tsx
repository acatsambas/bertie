import { useEffect, useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

import { makeStyles } from "@rneui/themed";
import { Switch } from "@rneui/themed";

import { LibraryNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import Text from "../../components/Text";
import Icon from "../../components/Icon";
import Input from "../../components/Input";
import SearchBooks from "../../components/SearchBooks";

export interface SearchBookProps
  extends StackNavigationProp<LibraryNavigatorParamList, "Search"> {}

const SearchBookScreen = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [author, setAuthor] = useState(false);
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<SearchBookProps>();

  useEffect(() => {
    searchInput.length !== 0 && fetchData();
  }, [searchInput]);

  const fetchData = async () => {
    const data = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${searchInput}&fields=items/volumeInfo/title,items/id,items/volumeInfo/description,items/volumeInfo/authors&orderBy=relevance&maxResults=40&key=${process.env.EXPO_PUBLIC_BOOKS_API_KEY}`
    );
    const json = await data.json();
    setSearchResults(json.items);
  };

  const searchDebounce = debounce((value) => setSearchInput(value.trim()), 500);

  const handleSearchQuery = (value: string) => {
    searchDebounce(value);
  };

  const handleCloseClick = () => {
    navigate("Library");
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text text={t(translations.library.search.title)} kind="bigHeader" />
          <Icon icon="left" onPress={handleCloseClick} />
        </View>
        <View style={styles.search}>
          <Input
            placeholder="What are you looking for today?"
            kind="search"
            onChangeText={handleSearchQuery}
            autoFocus={true}
          />
          <Switch />
        </View>
        {Object.keys(searchResults).length !== 0 && (
          <Text
            kind="paragraph"
            text={t(translations.library.search.addToList)}
          />
        )}
        <SearchBooks books={searchResults} />
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#FDF9F6",
    position: "relative",
  },
  container: {
    paddingTop: 20,
    gap: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  search: { alignItems: "flex-start" },
}));

export default SearchBookScreen;
