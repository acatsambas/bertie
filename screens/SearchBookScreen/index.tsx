import { useContext, useEffect, useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import firestore from "@react-native-firebase/firestore";

import { makeStyles } from "@rneui/themed";
import { Switch } from "@rneui/themed";
import { debounce } from "lodash";

import { LibraryNavigatorParamList } from "../../navigation/AppStack/params";
import { translations } from "../../locales/translations";
import Text from "../../components/Text";
import Icon from "../../components/Icon";
import Input from "../../components/Input";
import SearchBooks from "../../components/SearchBooks";
import { AuthContext } from "../../api/auth/AuthProvider";

export interface SearchBookProps
  extends StackNavigationProp<LibraryNavigatorParamList, "Search"> {}

const SearchBookScreen = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [isTitle, setIsTitle] = useState(false);
  const [toggleWord, setToggleWord] = useState("intitle");
  const [isFirstSearch, setIsFirstSearch] = useState(true);

  const { user } = useContext(AuthContext);
  const userId = user.uid;

  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<SearchBookProps>();

  useEffect(() => {
    searchInput.length !== 0 && fetchData();
  }, [searchInput]);

  useEffect(() => {
    handleFirstSearch();
  }, []);

  const fetchData = async () => {
    const data = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${toggleWord}:${searchInput}&fields=items/volumeInfo/title,items/id,items/volumeInfo/description,items/volumeInfo/authors&orderBy=relevance&maxResults=40&key=${process.env.EXPO_PUBLIC_BOOKS_API_KEY}`
    );
    const json = await data.json();
    setSearchResults(json.items);
  };

  const searchDebounce = debounce((value) => setSearchInput(value.trim()), 500);

  const handleSearchQuery = async (value: string) => {
    searchDebounce(value);
    setIsFirstSearch(false);
    await firestore().collection("users").doc(userId).set(
      {
        isFirstSearch: false,
      },
      { merge: true }
    );
  };

  const handleCloseClick = () => {
    navigate("Library");
  };

  const handleToggle = () => {
    setIsTitle(!isTitle);
    isTitle ? setToggleWord("intitle") : setToggleWord("inauthor");
  };

  const handleFirstSearch = async () => {
    const json = await firestore()?.collection("users")?.doc(userId)?.get();
    json.data().isFirstSearch === false &&
      setIsFirstSearch(json.data().isFirstSearch);
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
            placeholder={t(translations.library.search.placeholder)}
            kind="search"
            onChangeText={handleSearchQuery}
            autoFocus={true}
          />
          <View style={styles.toggle}>
            <Switch value={isTitle} onValueChange={handleToggle} />
            <Text
              text={
                isTitle
                  ? t(translations.library.search.toggle2)
                  : t(translations.library.search.toggle)
              }
              kind="paragraph"
            />
          </View>
        </View>
        {isFirstSearch && (
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
    paddingRight: 20,
  },
  search: { alignItems: "flex-start" },
  toggle: { flexDirection: "row", alignItems: "center", gap: 20 },
}));

export default SearchBookScreen;
