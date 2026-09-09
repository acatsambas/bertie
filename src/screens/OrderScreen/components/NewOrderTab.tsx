import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import AuthGateModal from 'components/AuthGateModal';
import Book from 'components/Book';

import { useAuthGate } from 'hooks/useAuthGate';

import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { useOrderList } from '../hooks/useOrderList';
import { OrderEmpty } from './OrderEmpty';
import { OrderFooter } from './OrderFooter';
import { OrderHeader } from './OrderHeader';

export interface NewOrderTabProps
  extends StackNavigationProp<NavigationType, typeof Routes.ORDER_01_ORDER> {}

export const NewOrderTab = () => {
  const styles = useStyles();
  const { navigate } = useNavigation<NewOrderTabProps>();
  const {
    unreadBooks,
    selectedBooks,
    orderList,
    fetchMoreBooks,
    loading,
    refetch,
    toggleOrder,
  } = useOrderList();
  const [refreshing, setRefreshing] = useState(false);
  const { requireAuth, gateVisible, gateMessage, dismissGate, confirmGate } =
    useAuthGate();

  const handleNext = () => {
    if (requireAuth()) return;
    navigate(Routes.ORDER_02_ORDER_SHOP, {
      books: selectedBooks,
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <>
      <FlatList
        style={styles.list}
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
            hasBooks={selectedBooks.length > 0}
            onNext={handleNext}
          />
        }
        renderItem={({ item }) => (
          <Book
            key={item.id}
            title={item.volumeInfo?.title}
            author={item.volumeInfo?.authors?.join?.(', ')}
            kind="order"
            isChecked={orderList.includes(item.id)}
            onChange={() => toggleOrder(item.id)}
          />
        )}
        onEndReached={fetchMoreBooks}
        onEndReachedThreshold={0.5}
      />
      <AuthGateModal
        visible={gateVisible}
        message={gateMessage}
        onDismiss={dismissGate}
        onSignUp={confirmGate}
      />
    </>
  );
};

const useStyles = makeStyles(() => ({
  list: { flex: 1 },
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    gap: 20,
  },
}));
