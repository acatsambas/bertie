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

import {
  useAddBookToLibraryMutation,
  useUserBooksIdsQuery,
} from 'api/app/book';
import { bookDescription } from 'api/google-books/bookDescription';

import { useAuthGate } from 'hooks/useAuthGate';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

export const BookScreen = () => {
  const { params } =
    useRoute<RouteProp<NavigationType, typeof Routes.LIBRARY_02_BOOK>>();
  const styles = useStyles();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { data: userBooksIds = [] } = useUserBooksIdsQuery();
  const { mutate: addBookToLibrary } = useAddBookToLibraryMutation();
  const { isGuest, requireAuth, gateVisible, gateMessage, dismissGate, confirmGate } = useAuthGate();
  const [description, setDescription] = useState<string | null>(null);

  const isBookInLibrary = userBooksIds.some(({ id }) => id === params.book.id);

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
        </View>
        <RenderHtml source={{ html: description }} contentWidth={0} />
      </ScrollView>
      <View style={styles.buttonContainer}>
        {!isBookInLibrary ? (
          <>
            <Button
              kind="primary"
              text={t(translations.library.add)}
              onPress={() => handlePressBook()}
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
              text={t(translations.library.orderNow)}
              onPress={handleOrderNow}
            />
            <Button
              kind="tertiary"
              text={t(translations.library.remove)}
              onPress={() => handlePressBook()}
            />
          </>
        )}
      </View>
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
  buttonContainer: {
    padding: 20,
    gap: 20,
    flexDirection: 'column',
  },
}));
