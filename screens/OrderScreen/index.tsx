import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserBooks } from '../../api/app/hooks';
import BottomMenu from '../../components/BottomMenu';
import Button from '../../components/Button';
import OrderBooksList from '../../components/OrderBooksList';
import Text from '../../components/Text';
import { translations } from '../../locales/translations';
import { OrderNavigatorParamList } from '../../navigation/AppStack/params';

export interface OrderPageProps
  extends StackNavigationProp<OrderNavigatorParamList, 'Order'> {}

const OrderScreen = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<OrderPageProps>();
  const books = useUserBooks({ withRefs: true });
  const [localBooks, setLocalBooks] = useState(books);
  const [componentIsMounted, setComponentIsMounted] = useState(false);

  useEffect(() => {
    if (books.length && componentIsMounted) {
      setLocalBooks(books.filter(({ isRead }) => !isRead));
    }

    setComponentIsMounted(true);
  }, [books, componentIsMounted]);

  const handleNext = () => {
    navigate('OrderShop', {
      books: localBooks,
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text text={t(translations.order.title)} kind="bigHeader" />

        {localBooks.length > 0 ? (
          <>
            <Text text={t(translations.order.header)} kind="header" />
            <OrderBooksList books={localBooks} setBooks={setLocalBooks} />
            <Text text={t(translations.order.details)} kind="header" />
          </>
        ) : (
          <>
            <Text text={t(translations.order.headerNoBooks)} kind="header" />
            <Text text={t(translations.order.suggestions)} kind="paragraph" />
          </>
        )}

        {localBooks.length > 0 && (
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

const useStyles = makeStyles(theme => ({
  safeAreaView: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
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
