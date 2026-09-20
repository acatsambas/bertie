import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles, useTheme } from '@rneui/themed';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUpdateFirstSearchFlagMutation, useUserQuery } from 'api/app/user';
import { BookResult, searchBooks } from 'api/google-books/search';
import { BackTitleHeader } from 'components/BackTitleHeader';
import EmptyState from 'components/EmptyState';
import Input from 'components/Input';
import LoadingState from 'components/LoadingState/LoadingState';
import SearchBooks from 'components/SearchBooks';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { goBackOrFallback } from 'navigation/goBackOrFallback';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

export interface SearchBookProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.LIBRARY_03_SEARCH
> {}

type SearchField = 'intitle' | 'inauthor';

const SEARCH_FIELDS: SearchField[] = ['intitle', 'inauthor'];

const SearchFieldScope = ({
  value,
  onChange,
}: {
  value: SearchField;
  onChange(value: SearchField): void;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.scope} accessibilityRole="tablist">
      {SEARCH_FIELDS.map(field => {
        const selected = field === value;
        const label =
          field === 'intitle'
            ? t(translations.library.search.byTitle)
            : t(translations.library.search.byAuthor);

        return (
          <Pressable
            key={field}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(field)}
            style={[styles.scopeOption, selected && styles.scopeOptionSelected]}
          >
            <Text
              kind="description"
              text={label}
              color={selected ? theme.colors.secondary : theme.colors.grey2}
              style={styles.scopeLabel}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

export const SearchBookScreen = () => {
  const [searchResults, setSearchResults] = useState<BookResult[]>([]);
  const [searchField, setSearchField] = useState<SearchField>('intitle');
  const [isLoading, setIsLoading] = useState(false);
  // A search that failed looks exactly like one that found nothing, unless
  // we keep them apart.
  const [searchFailed, setSearchFailed] = useState(false);
  // The search the results on screen came from. Typing runs ahead of the
  // debounce, so without this an empty list reads as "nothing found" before
  // the request has even gone out.
  const [settledQuery, setSettledQuery] = useState('');
  const { data: user } = useUserQuery();
  const updateFirstSearchFlag = useUpdateFirstSearchFlagMutation();
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<SearchBookProps>();
  const [searchValue, setSearchValue] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchDebounce = useCallback(
    debounce(async value => {
      const searchValue = value.trim();
      if (searchValue.length) {
        setIsLoading(true);
        try {
          const results = await searchBooks(searchValue, searchField);
          setSearchResults(results);
          setSearchFailed(false);
          setSettledQuery(`${searchField}:${searchValue}`);

          if (user && user.isFirstSearch) {
            await updateFirstSearchFlag.mutateAsync({ isFirstSearch: false });
          }
        } catch (error) {
          console.error('Search error:', error);
          // Say so, rather than leaving the last results — or nothing —
          // standing as if that were the answer.
          setSearchResults([]);
          setSearchFailed(true);
          setSettledQuery(`${searchField}:${searchValue}`);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      setSearchResults([]);
      setSearchFailed(false);
      setSettledQuery('');
    }, 350),
    [searchField],
  );

  useEffect(() => {
    if (searchValue.trim().length) {
      searchDebounce(searchValue);
    }
  }, [searchField, searchValue, searchDebounce]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      searchDebounce(value);
    },
    [searchDebounce],
  );

  const handleCloseClick = () => {
    goBackOrFallback(navigation, Routes.LIBRARY_03_SEARCH);
  };

  const placeholder =
    searchField === 'intitle'
      ? t(translations.library.search.placeholderTitle)
      : t(translations.library.search.placeholderAuthor);

  const otherFieldLabel =
    searchField === 'intitle'
      ? t(translations.library.search.byAuthor)
      : t(translations.library.search.byTitle);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BackTitleHeader
          title={t(translations.library.search.title)}
          onBack={handleCloseClick}
        />

        <View style={styles.searchCluster}>
          <Input
            placeholder={placeholder}
            kind="search"
            icon="search"
            onChangeText={handleSearch}
            autoFocus
            value={searchValue}
            marginTop={0}
          />
          <SearchFieldScope value={searchField} onChange={setSearchField} />
        </View>

        {user?.isFirstSearch !== false && (
          <Text
            kind="paragraph"
            text={t(translations.library.search.addToList)}
            color={theme.colors.grey2}
          />
        )}

        {isLoading ? (
          <LoadingState />
        ) : searchFailed ? (
          <EmptyState
            variant="list"
            icon="search"
            title={t(translations.library.search.failedTitle)}
            description={t(translations.library.search.failed)}
            action={{
              label: t(translations.library.tryAgain),
              onPress: () => searchDebounce(searchValue),
            }}
          />
        ) : (
          <>
            <SearchBooks books={searchResults} />
            {settledQuery === `${searchField}:${searchValue.trim()}` &&
              searchResults.length === 0 && (
                <EmptyState
                  variant="list"
                  icon="search"
                  title={t(translations.library.search.noMatchesTitle)}
                  description={t(translations.library.search.noMatches, {
                    search: searchValue.trim(),
                    other: otherFieldLabel,
                  })}
                />
              )}
          </>
        )}
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
    gap: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 40,
  },
  searchCluster: {
    gap: 10,
  },
  scope: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
    backgroundColor: theme.colors.grey0,
    gap: 2,
  },
  scopeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  scopeOptionSelected: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
  },
  scopeLabel: {
    textAlign: 'center',
  },
}));
