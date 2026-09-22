import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles } from '@rneui/themed';
import { useAuthGate } from 'hooks/useAuthGate';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import AuthGateModal from 'components/AuthGateModal';
import Book from 'components/Book';
import { Routes } from 'navigation/routes';
import { NavigationType } from 'navigation/types';

import { useOrderList } from '../hooks/useOrderList';
import { ORDER_TAB_GUTTER } from '../orderTabGutter';
import { OrderEmpty } from './OrderEmpty';
import { OrderFooter } from './OrderFooter';
import { OrderHeader } from './OrderHeader';

export interface NewOrderTabProps extends StackNavigationProp<
  NavigationType,
  typeof Routes.ORDER_01_ORDER
> {}

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

  const hasSelection = selectedBooks.length > 0;
  const isEmpty = !loading && unreadBooks.length === 0;

  const handleNext = () => {
    if (requireAuth()) return;
    navigate(Routes.ORDER_02_ORDER_SHOP);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <View style={styles.root}>
      {isEmpty ? (
        <View style={styles.gutter}>
          <OrderEmpty />
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={unreadBooks}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={[
            styles.listContent,
            hasSelection ? styles.containerWithDock : null,
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <OrderHeader hasBooks={unreadBooks.length > 0} />
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
      )}
      <OrderFooter hasBooks={hasSelection} onNext={handleNext} />
      <AuthGateModal
        visible={gateVisible}
        message={gateMessage}
        onDismiss={dismissGate}
        onSignUp={confirmGate}
      />
    </View>
  );
};

const useStyles = makeStyles(() => ({
  root: { flex: 1 },
  list: { flex: 1 },
  gutter: {
    ...ORDER_TAB_GUTTER,
  },
  listContent: {
    ...ORDER_TAB_GUTTER,
    gap: 20,
  },
  containerWithDock: {
    paddingBottom: 24,
  },
}));
