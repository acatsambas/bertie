import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from 'components/Button';
import DiscoverRecommendedBooks from 'components/DiscoverRecommendedBooks';
import OrderBooksList from 'components/OrderBooksList';
import Text from 'components/Text';

import { useUserBooks } from 'api/app/hooks';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { translations } from 'locales/translations';

export interface OrderPageProps
  extends StackNavigationProp<NavigationType, typeof Routes.ORDER_01_ORDER> {}

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
    navigate(Routes.ORDER_02_ORDER_SHOP, {
      books: localBooks,
    });
  };

  return (
    <SafeAreaView edges={['left', 'right', 'top']} style={styles.safeAreaView}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
            <DiscoverRecommendedBooks kind="order" />
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
}));

export default OrderScreen;
