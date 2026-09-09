import { makeStyles } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, View } from 'react-native';

import Text from 'components/Text';

import { useOrderHistoryQuery } from 'api/app/orders';
import { Order } from 'api/app/types';

import { translations } from 'locales/translations';

const formatOrderDate = (order: Order) => {
  if (!order.createdAt?.seconds) return null;

  return new Date(order.createdAt.seconds * 1000).toLocaleDateString(
    undefined,
    { day: 'numeric', month: 'long', year: 'numeric' },
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const date = formatOrderDate(order);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text
          kind="header"
          text={order.shopName ?? t(translations.order.bookshop)}
        />
        {date && <Text kind="littleText" text={date} />}
      </View>

      <View style={styles.bookList}>
        {order.books.map(book => (
          <Text
            key={book.id}
            kind="paragraph"
            text={
              book.authors?.length
                ? `${book.title} — ${book.authors.join(', ')}`
                : (book.title ?? t(translations.order.history.unknownBook))
            }
          />
        ))}
      </View>

      <Text
        kind="description"
        text={t(translations.order.history.placed)}
        style={styles.status}
      />
    </View>
  );
};

export const PastOrdersTab = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { data: orders = [], isLoading } = useOrderHistoryQuery();

  if (isLoading) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centred}>
        <Text kind="header" text={t(translations.order.history.emptyTitle)} />
        <Text
          kind="paragraph"
          text={t(translations.order.history.emptyDescription)}
          style={styles.emptyDescription}
        />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={orders}
      keyExtractor={order => order.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
};

const useStyles = makeStyles(() => ({
  list: { flex: 1 },
  // Now that the screen container carries no horizontal padding of its own
  // (matching Discover), this list supplies its own gutter. `centred` below
  // already had one — it renders outside the FlatList for the loading and
  // empty states.
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyDescription: {
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F8EBDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  cardHeader: {
    gap: 2,
  },
  bookList: {
    gap: 4,
  },
  status: {
    fontStyle: 'italic',
  },
}));
