import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import { useAuthGate } from 'hooks/useAuthGate';
import { useIsDesktop } from 'hooks/useIsDesktop';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useAddBookToLibraryMutation,
  useRateBookMutation,
  useUserBooksIdsQuery,
  useBookRatingsQuery,
  useUserBookRatingQuery,
  useStoredBookQuery,
} from 'api/app/book';
import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';
import { AuthContext } from 'api/auth/AuthProvider';
import { useBookQuery } from 'api/google-books/useBookQuery';
import AuthGateModal from 'components/AuthGateModal';
import Button from 'components/Button';
import DesktopColumn from 'components/DesktopColumn';
import EmptyState from 'components/EmptyState';
import Icon from 'components/Icon';
import RatingBottomSheet from 'components/RatingBottomSheet';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { goBackOrFallback } from 'navigation/goBackOrFallback';
import BottomMenu from 'navigation/navigators/components/BottomMenu';
import SideRail from 'navigation/navigators/components/SideRail';
import { Routes } from 'navigation/routes';

const computeMedian = (values: RatingValue[]): RatingValue | null => {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2) as RatingValue;
  }
  return sorted[mid];
};

export const BookScreen = () => {
  const { params } =
    useRoute<RouteProp<{ route: { bookId: string } }, 'route'>>();
  const {
    data: googleBook,
    isLoading: isBookLoading,
    isFetching: isBookFetching,
    refetch: refetchBook,
  } = useBookQuery(params.bookId);
  // Bertie's own copy, saved when someone first added or rated this book. It
  // fills the page in while Google answers, and stands in when Google is slow
  // or down, so the title and the buttons are there either way.
  const { data: storedBook, isLoading: isStoredLoading } = useStoredBookQuery(
    params.bookId,
  );
  const book = googleBook ?? storedBook ?? undefined;
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { user } = useContext(AuthContext);
  const { data: userBooksIds = [] } = useUserBooksIdsQuery();
  const { mutate: addBookToLibrary } = useAddBookToLibraryMutation();
  const { mutate: rateBook } = useRateBookMutation();
  const { data: ratings = [] } = useBookRatingsQuery(params.bookId);
  const { data: userRating = null } = useUserBookRatingQuery(params.bookId);
  const {
    isGuest,
    isLoggedOut,
    requireAuth,
    gateVisible,
    gateMessage,
    dismissGate,
    confirmGate,
  } = useAuthGate();
  const [ratingSheetVisible, setRatingSheetVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuAnchorRef = useRef<View>(null);
  const isDesktop = useIsDesktop();

  const isBookInLibrary = userBooksIds.some(({ id }) => id === params.bookId);
  // The book query already brings the description back, so this screen
  // doesn't ask Google for the same volume a second time.
  const description = book?.volumeInfo?.description ?? null;
  const medianRating = computeMedian(ratings);

  const medianKeys: Record<RatingValue, string> = {
    1: translations.library.rating.median1,
    2: translations.library.rating.median2,
    3: translations.library.rating.median3,
    4: translations.library.rating.median4,
  };

  // Update browser tab title when book data loads
  useEffect(() => {
    if (book?.volumeInfo?.title && Platform.OS === 'web') {
      document.title = `${book.volumeInfo.title} — Bertie`;
    }
    return () => {
      if (Platform.OS === 'web') {
        document.title = 'Bertie';
      }
    };
  }, [book?.volumeInfo?.title]);

  // Logged-out visitors arrive here through a shared link. They can read the
  // page, but every action below writes to their library, so it needs an
  // account. Guests are already signed in and keep their existing allowances.
  const requireAccount = (message: string) =>
    isLoggedOut && requireAuth(message);

  const handleAddOrRemove = () => {
    if (!book) return;
    if (requireAccount(t(translations.authGate.addBook))) return;
    // Gate: guests can't add more than 3 books
    if (!isBookInLibrary && isGuest && userBooksIds.length >= 3) {
      requireAuth(t(translations.authGate.bookLimit));
      return;
    }
    addBookToLibrary({ book, isUserBook: isBookInLibrary });
  };

  const handleOrderNow = () => {
    if (!book) return;
    // Gate: ordering needs a real account, for guests and logged-out alike
    if (requireAuth(t(translations.authGate.order))) return;
    // The book screen lives at the root, outside the tab tree, so the
    // order screen has to be addressed through the full nesting path.
    navigation.navigate(Routes.ROOT_02_APP, {
      screen: Routes.APP_01_HOME,
      params: {
        screen: Routes.HOME_03_ORDER,
        params: {
          screen: Routes.ORDER_00_ADD_BOOKS,
          params: { bookId: book.id },
        },
      },
    });
  };

  const handleRate = (rating: RatingValue) => {
    if (!book) return;
    if (requireAccount(t(translations.authGate.rate))) return;
    // Tapping the rating you already gave takes it off.
    rateBook({
      bookId: params.bookId,
      rating: rating === userRating ? null : rating,
      book,
    });
    setTimeout(() => setRatingSheetVisible(false), 500);
  };

  // A visitor who arrived straight from a shared link has nothing beneath this
  // screen to pop back to — and after signing up, the auth screen they came
  // through is gone too. Send them into their library instead, and hide the
  // arrow entirely while there is still no app to go back to.
  const canGoBack = navigation.canGoBack();
  const inApp = !!user || isGuest;
  const showBack = canGoBack || inApp;

  // On desktop the side rail stands in for the tab bar here too, and the page
  // sits in the same centred column as the tab screens.
  const withDesktopChrome = (screen: React.ReactElement) =>
    isDesktop && inApp ? (
      <View style={styles.desktopShell}>
        <SideRail />
        <DesktopColumn>{screen}</DesktopColumn>
      </View>
    ) : (
      screen
    );

  const handleBack = () => {
    goBackOrFallback(navigation, Routes.ROOT_06_BOOK);
  };

  const openMenu = () => {
    menuAnchorRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPosition({ top: y + height + 4, right: 20 });
      setMenuVisible(true);
    });
  };

  const handleMenuRate = () => {
    setMenuVisible(false);
    if (requireAccount(t(translations.authGate.rate))) return;
    setRatingSheetVisible(true);
  };

  const handleMenuRemove = () => {
    setMenuVisible(false);
    handleAddOrRemove();
  };

  // Only a spinner while both sources are still out; whichever lands first
  // renders the page.
  if (!book && (isBookLoading || isStoredLoading || isBookFetching)) {
    return withDesktopChrome(
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.backHeader}>
          {showBack && <Icon icon="back" onPress={handleBack} />}
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>,
    );
  }

  // Google was unreachable or had nothing for this id. Say so and offer
  // another go, rather than spinning forever.
  if (!book) {
    return withDesktopChrome(
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.backHeader}>
          {showBack && <Icon icon="back" onPress={handleBack} />}
        </View>
        <View style={styles.loadingContainer}>
          <EmptyState
            variant="page"
            icon="book"
            title={t(translations.library.loadErrorTitle)}
            description={t(translations.library.loadError)}
            action={{
              label: t(translations.library.tryAgain),
              onPress: () => void refetchBook(),
            }}
          />
        </View>
      </SafeAreaView>,
    );
  }

  const bookTitle = book.volumeInfo?.title ?? '';

  return withDesktopChrome(
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            {showBack ? (
              <Pressable
                onPress={handleBack}
                style={styles.titleBack}
                accessibilityRole="button"
                accessibilityLabel={bookTitle}
              >
                <Icon icon="back" />
                <Text kind="bigHeader" text={bookTitle} style={styles.title} />
              </Pressable>
            ) : (
              <Text kind="bigHeader" text={bookTitle} />
            )}
            <Text
              kind="paragraph"
              text={book.volumeInfo?.authors?.join?.(', ')}
            />
            {medianRating != null && (
              <Text
                kind="description"
                text={t(medianKeys[medianRating])}
                style={styles.medianRating}
              />
            )}
          </View>
          <View ref={menuAnchorRef} collapsable={false}>
            <TouchableOpacity
              onPress={openMenu}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon icon="dotsHorizontal" color={theme.colors.black} />
            </TouchableOpacity>
          </View>
        </View>
        {description != null && (
          <RenderHtml source={{ html: description }} contentWidth={0} />
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        {!isBookInLibrary ? (
          <>
            <Button
              kind="primary"
              text={t(translations.library.add)}
              onPress={handleAddOrRemove}
            />
            <Button
              kind="tertiary"
              text={t(translations.library.orderNow)}
              onPress={handleOrderNow}
            />
          </>
        ) : (
          <>
            <Button
              kind="primary"
              text={t(translations.library.rating.rate)}
              onPress={() => setRatingSheetVisible(true)}
            />
            <Button
              kind="tertiary"
              text={t(translations.library.orderNow)}
              onPress={handleOrderNow}
            />
          </>
        )}
      </View>

      {/* Overflow menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={[
              styles.menuCard,
              { top: menuPosition.top, right: menuPosition.right },
            ]}
          >
            {!isBookInLibrary ? (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleMenuRate}
              >
                <Text
                  kind="paragraph"
                  text={t(translations.library.rating.rate)}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleMenuRemove}
              >
                <Text kind="paragraph" text={t(translations.library.remove)} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <RatingBottomSheet
        visible={ratingSheetVisible}
        currentRating={userRating}
        onRate={handleRate}
        onClose={() => setRatingSheetVisible(false)}
      />
      <AuthGateModal
        visible={gateVisible}
        message={gateMessage}
        onDismiss={dismissGate}
        onSignUp={confirmGate}
      />

      {/* This screen sits outside the tab navigator, so it renders the tab
          bar itself — but only for signed-in users, since a logged-out
          visitor arriving via a shared link has nowhere to tab to. On
          desktop the side rail takes its place. */}
      {inApp && !isDesktop && <BottomMenu />}
    </SafeAreaView>,
  );
};

const useStyles = makeStyles(theme => ({
  desktopShell: {
    flex: 1,
    flexDirection: 'row',
  },
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },
  container: { paddingTop: 20, gap: 20 },
  loadingContainer: {
    flex: 1,
    alignItems: 'stretch',
    paddingTop: 20,
    gap: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleText: {
    flex: 1,
    marginRight: 12,
  },
  titleBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  title: {
    flexShrink: 1,
  },
  medianRating: {
    fontStyle: 'italic',
    marginTop: 4,
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
    flexDirection: 'column',
  },
  menuOverlay: {
    flex: 1,
  },
  menuCard: {
    position: 'absolute',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    minWidth: 180,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
}));
