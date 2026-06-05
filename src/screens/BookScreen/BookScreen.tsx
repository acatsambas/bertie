import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
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
import { bookDescription } from 'api/google-books/bookDescription';

import { useAuthGate } from 'hooks/useAuthGate';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

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
    useRoute<RouteProp<NavigationType, typeof Routes.LIBRARY_02_BOOK>>();
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { data: userBooksIds = [] } = useUserBooksIdsQuery();
  const { mutate: addBookToLibrary } = useAddBookToLibraryMutation();
  const { mutate: rateBook } = useRateBookMutation();
  const { data: ratings = [] } = useBookRatingsQuery(params.book.id);
  const { data: userRating = null } = useUserBookRatingQuery(params.book.id);
  const { isGuest, requireAuth, gateVisible, gateMessage, dismissGate, confirmGate } = useAuthGate();
  const [description, setDescription] = useState<string | null>(null);
  const [ratingSheetVisible, setRatingSheetVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuAnchorRef = useRef<View>(null);

  const isBookInLibrary = userBooksIds.some(({ id }) => id === params.book.id);
  const medianRating = computeMedian(ratings);

  const medianKeys: Record<RatingValue, string> = {
    1: translations.library.rating.median1,
    2: translations.library.rating.median2,
    3: translations.library.rating.median3,
    4: translations.library.rating.median4,
  };

  useEffect(() => {
    const fetchDescription = async () => {
      const desc = await bookDescription(params.book.id);
      setDescription(desc);
    };

    void fetchDescription();
  }, [params.book.id]);

  const handleAddOrRemove = () => {
    // Gate: guests can't add more than 3 books
    if (!isBookInLibrary && isGuest && userBooksIds.length >= 3) {
      requireAuth(t(translations.authGate.bookLimit));
      return;
    }
    addBookToLibrary({ book: params.book, isUserBook: isBookInLibrary });
  };

  const handleOrderNow = () => {
    // Gate: guests can't order
    if (requireAuth()) return;
    navigation.navigate(Routes.HOME_03_ORDER, {
      screen: Routes.ORDER_00_ADD_BOOKS,
      params: { initialBook: params.book },
    });
  };

  const handleRate = (rating: RatingValue) => {
    rateBook({ bookId: params.book.id, rating, book: params.book });
    setTimeout(() => setRatingSheetVisible(false), 500);
  };

  const openMenu = () => {
    menuAnchorRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPosition({ top: y + height + 4, right: 20 });
      setMenuVisible(true);
    });
  };

  const handleMenuRate = () => {
    setMenuVisible(false);
    setRatingSheetVisible(true);
  };

  const handleMenuRemove = () => {
    setMenuVisible(false);
    handleAddOrRemove();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.backHeader}>
        <Icon icon="back" onPress={() => navigation.goBack()} />
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            <Text kind="bigHeader" text={params.book.volumeInfo?.title} />
            <Text
              kind="paragraph"
              text={params.book.volumeInfo?.authors?.join?.(', ')}
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

