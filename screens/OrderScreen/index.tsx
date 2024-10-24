import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

import { makeStyles } from '@rneui/themed';

import { translations } from '../../locales/translations';
import { OrderNavigatorParamList } from '../../navigation/AppStack/params';
import { AuthContext } from '../../api/auth/AuthProvider';
import BottomMenu from '../../components/BottomMenu';
import Text from '../../components/Text';
import OrderBooksList from '../../components/OrderBooksList';
import Button from '../../components/Button';

export interface OrderPageProps
  extends StackNavigationProp<OrderNavigatorParamList, 'Order'> {}

const OrderScreen = () => {
  const [books, setBooks] = useState([]);
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderPageProps>();
  const { user } = useContext(AuthContext);
  const userId = user.uid;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const userBooksSnapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('books')
      .get();
    const booksList = userBooksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(booksList);
  };

  const handleNext = () => {
    navigate('OrderShop');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text text={t(translations.order.title)} kind="bigHeader" />
        {books.length > 0 ? (
          <Text text={t(translations.order.header)} kind="header" />
        ) : (
          <Text text={t(translations.order.headerNoBooks)} kind="header" />
        )}
        {books.length > 0 && (
          <OrderBooksList books={books} setBooks={setBooks} />
        )}
        {books.length > 0 ? (
          <Text text={t(translations.order.details)} kind="header" />
        ) : (
          <Text text={t(translations.order.suggestions)} kind="paragraph" />
        )}
        {books.length > 0 && (
          <>
            <View>
              <Text text={`\u2022 First Name`} kind="description" />
              <Text text={`\u2022 Last Name`} kind="description" />
              <Text text={`\u2022 Email`} kind="description" />
              <Text text={`\u2022 Address`} kind="description" />
            </View>
            <Button
              kind="primary"
              text={t(translations.order.next)}
              onPress={handleNext}
            />
          </>
        )}
      </ScrollView>
      <View style={styles.bottomArea}>
        <BottomMenu />
      </View>
    </SafeAreaView>
  );
};

const useStyles = makeStyles(() => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FDF9F6',
  },
  container: {
    paddingTop: 20,
    paddingBottom: 120,
    gap: 20,
    position: 'relative',
  },
  nextButton: { paddingHorizontal: 20 },
  bottomArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
}));

export default OrderScreen;
