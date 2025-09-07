import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Book from 'components/Book';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { OrderEmpty, OrderFooter, OrderHeader } from './components/';
import { useOrderList } from './hooks/useOrderList';

export interface OrderPageProps
  extends StackNavigationProp<NavigationType, typeof Routes.ORDER_01_ORDER> {}

export const OrderScreen = () => {
  const styles = useStyles();
  const { navigate } = useNavigation<OrderPageProps>();
  const { unreadBooks, fetchMoreBooks, loading, refetch, removeFromOrder } =
    useOrderList();
  const [refreshing, setRefreshing] = useState(false);

  const handleNext = () => {
    navigate(Routes.ORDER_02_ORDER_SHOP, {
      books: unreadBooks,
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <SafeAreaView edges={['left', 'right', 'top']} style={styles.safeAreaView}>
      <FlatList
        data={unreadBooks}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<OrderHeader hasBooks={unreadBooks.length > 0} />}
        ListEmptyComponent={OrderEmpty}
        ListFooterComponent={
          <OrderFooter
            loading={loading}
            hasBooks={unreadBooks.length > 0}
            onNext={handleNext}
          />
        }
        renderItem={({ item }) => (
          <Book
            key={item.id}
            title={item.volumeInfo?.title}
            author={item.volumeInfo?.authors?.join?.(', ')}
            kind="order"
            isChecked={item.isRead}
            onChange={() => removeFromOrder(item.id)}
          />
        )}
        onEndReached={fetchMoreBooks}
        onEndReachedThreshold={0.5}
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
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
  },
}));
