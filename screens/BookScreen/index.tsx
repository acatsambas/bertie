import firestore from '@react-native-firebase/firestore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { makeStyles } from '@rneui/themed';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserBooks } from '../../api/app/hooks';
import { AuthContext } from '../../api/auth/AuthProvider';
import Button from '../../components/Button';
import Text from '../../components/Text';
import { translations } from '../../locales/translations';
import { LibraryNavigatorParamList } from '../../navigation/AppStack/params';

const BookScreen = () => {
  const { params } = useRoute<RouteProp<LibraryNavigatorParamList, 'Book'>>();
  const styles = useStyles();
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const userBooks = useUserBooks();
  const { user } = useContext(AuthContext);

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
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text kind="bigHeader" text={params.book.volumeInfo?.title} />
          <Text
            kind="paragraph"
            text={params.book.volumeInfo?.authors?.join?.(', ')}
          />
        </View>
        <RenderHtml
          source={{ html: params.book.volumeInfo?.description }}
          contentWidth={0}
        />
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
