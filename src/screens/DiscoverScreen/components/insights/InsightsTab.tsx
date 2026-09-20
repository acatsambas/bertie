import { makeStyles } from '@rneui/themed';
import { useIsDesktop } from 'hooks/useIsDesktop';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import {
  useOtherReadersRatingsQuery,
  useReadingInsightsQuery,
} from 'api/app/book';
import { useGuest } from 'api/guest/GuestProvider';
import LoadingState from 'components/LoadingState/LoadingState';
import Text from 'components/Text';
import { translations } from 'locales/translations';

import { compareRatings, computeInsights } from './computeInsights';
import { DesktopInsights } from './DesktopInsights';
import { MobileInsights } from './MobileInsights';
import { OthersStatus } from './RatingsSection';

/** What the reader's finished and rated books say about their reading. */
export const InsightsTab = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const isDesktop = useIsDesktop();
  const { isGuest } = useGuest();
  const {
    data: books,
    isLoading,
    isError,
    pendingCount,
  } = useReadingInsightsQuery();
  const insights = useMemo(
    () => (books ? computeInsights(books) : null),
    [books],
  );

  // Sorted, so the query doesn't refetch just because the list reordered.
  const ratedIds = (books ?? [])
    .filter(book => book.rating)
    .map(book => book.id)
    .sort();
  const others = useOtherReadersRatingsQuery(ratedIds);
  const comparison = useMemo(
    () => compareRatings(books ?? [], others.data ?? {}),
    [books, others.data],
  );
  // Guests can't read other people's ratings, so they see only their own.
  const othersStatus: OthersStatus =
    isGuest || others.isError
      ? 'unavailable'
      : others.isPending
        ? 'loading'
        : 'ready';
  const ratings = { comparison, othersStatus };

  if (isLoading) return <LoadingState />;

  if (!insights || insights.readCount === 0) {
    return (
      <View style={styles.empty}>
        <Text
          kind="paragraph"
          text={t(
            isError
              ? translations.discover.insights.error
              : translations.discover.insights.empty,
          )}
          style={styles.emptyText}
        />
      </View>
    );
  }

  return isDesktop ? (
    <DesktopInsights
      insights={insights}
      pendingCount={pendingCount}
      ratings={ratings}
    />
  ) : (
    <MobileInsights
      insights={insights}
      pendingCount={pendingCount}
      ratings={ratings}
    />
  );
};

const useStyles = makeStyles(() => ({
  empty: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    maxWidth: 420,
    textAlign: 'center',
  },
}));

export default InsightsTab;
