import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import Icon from 'components/Icon';
import Text from 'components/Text';
import AuthGateModal from 'components/AuthGateModal';
import RatingBottomSheet from 'components/RatingBottomSheet';

import {
  useAddBookToLibraryMutation,
  useRateBookMutation,
  useUserBooksIdsQuery,
  useBookRatingsQuery,
  useUserBookRatingQuery,
} from 'api/app/book';
import { RatingValue } from 'api/app/book/mutations/useRateBookMutation';
import { AuthContext } from 'api/auth/AuthProvider';
import { bookDescription } from 'api/google-books/bookDescription';
import { useBookQuery } from 'api/google-books/useBookQuery';

import { useAuthGate } from 'hooks/useAuthGate';

import BottomMenu from 'navigation/navigators/components/BottomMenu';
import { Routes } from 'navigation/routes';

import { translations } from 'locales/translations';

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
  const { data: book, isLoading: isBookLoading } = useBookQuery(params.bookId);
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
  const { isGuest, isLoggedOut, requireAuth, gateVisible, gateMessage, dismissGate, confirmGate } = useAuthGate();
  const [description, setDescription] = useState<string | null>(null);
  const [ratingSheetVisible, setRatingSheetVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuAnchorRef = useRef<View>(null);

  const isBookInLibrary = userBooksIds.some(({ id }) => id === params.bookId);
  const medianRating = computeMedian(ratings);

  const medianKeys: Record<RatingValue, string> = {
    1: translations.library.rating.median1,
    2: translations.library.rating.median2,
    3: translations.library.rating.median3,
    4: translations.library.rating.median4,
  };

  useEffect(() => {
    const fetchDescription = async () => {
      const desc = await bookDescription(params.bookId);
      setDescription(desc);
    };

    void fetchDescription();
  }, [params.bookId]);

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
          params: { initialBook: book },
        },
      },
    });
  };

  const handleRate = (rating: RatingValue) => {
    if (!book) return;
    if (requireAccount(t(translations.authGate.rate))) return;
    rateBook({ bookId: params.bookId, rating, book });
    setTimeout(() => setRatingSheetVisible(false), 500);
  };

  // A visitor who arrived straight from a shared link has nothing beneath this
  // screen to pop back to — and after signing up, the auth screen they came
  // through is gone too. Send them into their library instead, and hide the
  // arrow entirely while there is still no app to go back to.
  const canGoBack = navigation.canGoBack();
  const showBack = canGoBack || !!user;

  const handleBack = () => {
    if (canGoBack) {
      navigation.goBack();
      return;
    }
    navigation.navigate(Routes.ROOT_02_APP, {
      screen: Routes.APP_01_HOME,
      params: { screen: Routes.HOME_01_LIBRARY },
    });
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

  if (isBookLoading || !book) {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.backHeader}>
          {showBack && <Icon icon="back" onPress={handleBack} />}
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.backHeader}>
        {showBack && <Icon icon="back" onPress={handleBack} />}
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            <Text kind="bigHeader" text={book.volumeInfo?.title} />
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
          <View style={[styles.menuCard, { top: menuPosition.top, right: menuPosition.right }]}>
            {!isBookInLibrary ? (
              <TouchableOpacity style={styles.menuItem} onPress={handleMenuRate}>
                <Text kind="paragraph" text={t(translations.library.rating.rate)} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.menuItem} onPress={handleMenuRemove}>
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
          visitor arriving via a shared link has nowhere to tab to. */}
      {user && <BottomMenu />}
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
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
  container: { paddingTop: 10, gap: 20 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    flex: 1,
    marginRight: 12,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 180,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
}));

