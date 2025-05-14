import firestore from '@react-native-firebase/firestore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import Text from 'components/Text';

import { useUserBooks } from 'api/app/hooks';
import { AuthContext } from 'api/auth/AuthProvider';
import { bookDescription } from 'api/google-books/bookDescription';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';
//
const BookScreen = () => {
  const { params } =
    useRoute<RouteProp<NavigationType, typeof Routes.LIBRARY_02_BOOK>>();
  const styles = useStyles();
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const userBooks = useUserBooks();
  const { user } = useContext(AuthContext);

  const [description, setDescription] = useState<string | null>(null);

  useEffect(() => {
    const fetchDescription = async () => {
      const desc = await bookDescription(params.book.id);
      setDescription(desc);
    };

    fetchDescription();
  }, [params.book.id]);

  const handlePressBook = async () => {
    const bookRef = firestore().collection('books').doc(params.book.id);

    if (!(await bookRef.get()).exists) {
      await firestore()
        .collection('books')
        .doc(params.book.id)
        .set(params.book);
    }

    const userBookRef = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('books')
      .doc(params.book.id);

    if ((await userBookRef.get()).exists) {
      userBookRef.delete();
    } else {
      userBookRef.set({ bookRef });
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
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
        {!userBooks.some(book => book.id === params.book.id) ? (
          <>
            <Button
              kind="primary"
              text={t(translations.library.add)}
              onPress={() => handlePressBook()}
            />
            <Button
              kind="tertiary"
              text={t(translations.library.back)}
              onPress={() => goBack()}
            />
          </>
        ) : (
          <>
            <Button
              kind="primary"
              text={t(translations.library.back)}
              onPress={() => goBack()}
            />
            <Button
              kind="tertiary"
              text={t(translations.library.remove)}
              onPress={() => handlePressBook()}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  container: { paddingTop: 20, gap: 20 },
  buttonContainer: {
    padding: 20,
    gap: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default BookScreen;
