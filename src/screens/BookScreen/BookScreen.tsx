import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
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

  const handlePressBook = () => {
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
    rateBook({ bookId: params.book.id, rating });
    setRatingSheetVisible(false);
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
        <View>
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
        <RenderHtml source={{ html: description }} contentWidth={0} />
      </ScrollView>
      <View style={styles.buttonContainer}>
        {!isBookInLibrary ? (
          <Button
            kind="primary"
            text={t(translations.library.add)}
            onPress={() => handlePressBook()}
          />
        ) : (
          <Button
            kind="primary"
            text={t(translations.library.orderNow)}
            onPress={handleOrderNow}
          />
        )}
        <View style={styles.secondaryRow}>
          <View style={styles.halfButton}>
            <Button
              kind="tertiary"
              text={t(translations.library.rating.rate)}
              onPress={() => setRatingSheetVisible(true)}
            />
          </View>
          <View style={styles.halfButton}>
            {!isBookInLibrary ? (
              <Button
                kind="tertiary"
                text={t(translations.library.orderNow)}
                onPress={handleOrderNow}
              />
            ) : (
              <Button
                kind="tertiary"
                text={t(translations.library.remove)}
                onPress={() => handlePressBook()}
              />
            )}
          </View>
        </View>
      </View>
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
  medianRating: {
    fontStyle: 'italic',
    marginTop: 4,
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
    flexDirection: 'column',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfButton: {
    flex: 1,
  },
}));
