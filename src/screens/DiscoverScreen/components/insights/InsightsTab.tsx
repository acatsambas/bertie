import { makeStyles } from '@rneui/themed';
import { useIsDesktop } from 'hooks/useIsDesktop';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import LoadingState from 'components/LoadingState/LoadingState';
import Text from 'components/Text';

import { useReadingInsightsQuery } from 'api/app/book';

import { translations } from 'locales/translations';

import { DesktopInsights } from './DesktopInsights';
import { MobileInsights } from './MobileInsights';
import { computeInsights } from './computeInsights';

/** What the reader's finished and rated books say about their reading. */
export const InsightsTab = () => {
  const styles = useStyles();
  const { t } = useTranslation();
  const isDesktop = useIsDesktop();
  const { data: books, isLoading, isError } = useReadingInsightsQuery();
  const insights = useMemo(
    () => (books ? computeInsights(books) : null),
    [books],
  );

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
    <DesktopInsights insights={insights} />
  ) : (
    <MobileInsights insights={insights} />
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
