import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import Text from 'components/Text';

import { translations } from 'locales/translations';

import { OthersStatus, RatingsSection } from './RatingsSection';
import {
  RatingComparison,
  ReadingInsights,
  byCentury,
} from './computeInsights';
import { FictionSection, PendingLookups, RankedSection } from './parts';
import { useInsightsSummary } from './useInsightsSummary';

/** Insights on phones and the PWA: the summary, then one list after another. */
export const MobileInsights = ({
  insights,
  pendingCount,
  ratings,
}: {
  insights: ReadingInsights;
  pendingCount: number;
  ratings: { comparison: RatingComparison; othersStatus: OthersStatus };
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { summary, counts, pending } = useInsightsSummary(
    insights,
    pendingCount,
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.summary}>
        {!!summary && (
          <Text kind="header" text={summary} style={styles.summaryText} />
        )}
        <Text
          kind="littleText"
          text={`${counts} · ${t(translations.discover.insights.ratingScale)}`}
          color={theme.colors.grey2}
        />
        {!!pending && <PendingLookups text={pending} />}
      </View>
      <RankedSection
        title={t(translations.discover.insights.authors)}
        groups={insights.authors}
        variant="mobile"
      />
      <RankedSection
        title={t(translations.discover.insights.genres)}
        groups={insights.genres}
        variant="mobile"
      />
      <RankedSection
        title={t(translations.discover.insights.centuries)}
        subtitle={t(translations.discover.insights.centuriesSubtitle)}
        groups={insights.centuries}
        variant="mobile"
        sortShown={byCentury}
        showAll
      />
      <FictionSection insights={insights} variant="mobile" />
      <RatingsSection
        comparison={ratings.comparison}
        othersStatus={ratings.othersStatus}
        variant="mobile"
      />
    </ScrollView>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 40,
    gap: 32,
  },
  summary: {
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3EAFF',
  },
  summaryText: {
    fontSize: 20,
    lineHeight: 28,
  },
}));

export default MobileInsights;
