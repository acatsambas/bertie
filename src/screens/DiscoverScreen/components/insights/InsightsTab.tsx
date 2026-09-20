import { useNavigation } from '@react-navigation/native';
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
import EmptyState from 'components/EmptyState';
import LoadingState from 'components/LoadingState/LoadingState';
import { translations } from 'locales/translations';
import { Routes } from 'navigation/routes';

import { compareRatings, computeInsights } from './computeInsights';
import { DesktopInsights } from './DesktopInsights';
import { MobileInsights } from './MobileInsights';
import { OthersStatus } from './RatingsSection';

/** What the reader's finished and rated books say about their reading. */
export const InsightsTab = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { navigate } = useNavigation<any>();
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
    // Same gutter as Books: 20 all around on mobile; on desktop DesktopColumn
    // already supplies the horizontal inset, so don't double it.
    return (
      <View style={[styles.empty, isDesktop && styles.emptyDesktop]}>
        <EmptyState
          variant="list"
          icon="insights"
          title={t(
            isError
              ? translations.discover.insights.errorTitle
              : translations.discover.insights.emptyTitle,
          )}
          description={t(
            isError
              ? translations.discover.insights.errorDescription
              : translations.discover.insights.emptyDescription,
          )}
          action={
            isError
              ? undefined
              : {
                  label: t(translations.discover.insights.emptyAction),
                  onPress: () => navigate(Routes.HOME_01_LIBRARY),
                  kind: 'secondary',
                }
          }
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  emptyDesktop: {
    paddingHorizontal: 0,
  },
}));

export default InsightsTab;
