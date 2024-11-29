import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles, Switch } from '@rneui/themed';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUser } from '../../api/app/hooks';
import { BookResult, searchBooks } from '../../api/google-books/search';
import Icon from '../../components/Icon';
import Input from '../../components/Input';
import SearchBooks from '../../components/SearchBooks';
import Text from '../../components/Text';
import { translations } from '../../locales/translations';
import { LibraryNavigatorParamList } from '../../navigation/AppStack/params';

export interface SearchBookProps
  extends StackNavigationProp<LibraryNavigatorParamList, 'Search'> {}

const SearchBookScreen = () => {
  const [searchResults, setSearchResults] = useState<BookResult[]>([]);
  const [isTitle, setIsTitle] = useState(false);
  const [toggleWord, setToggleWord] = useState<'intitle' | 'inauthor'>(
    'intitle',
  );
  const user = useUser();
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<SearchBookProps>();
  const [searchValue, setSearchValue] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchDebounce = useCallback(
    debounce(async value => {
      const searchValue = value.trim();

      if (searchValue.length) {
        searchBooks(searchValue, toggleWord).then(setSearchResults);

        if (user.isFirstSearch !== false) {
          await firestore().collection('users').doc(user.documentId).update({
            isFirstSearch: false,
          });
        }

        return;
      }

      setSearchResults([]);
    }, 350),
    [toggleWord, user?.documentId, user?.isFirstSearch],
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      searchDebounce(value);
    },
    [searchDebounce],
  );

  const handleCloseClick = () => {
    navigate('Library');
  };

  const handleToggle = () => {
    setIsTitle(!isTitle);
    setToggleWord(isTitle ? 'intitle' : 'inauthor');
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
            onChangeText={handleSearch}
            autoFocus
            value={searchValue}
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
        {user?.isFirstSearch !== false && (
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

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
    position: 'relative',
  },
  container: {
    paddingTop: 20,
    gap: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  search: { alignItems: 'flex-start' },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 20 },
}));

export default SearchBookScreen;
