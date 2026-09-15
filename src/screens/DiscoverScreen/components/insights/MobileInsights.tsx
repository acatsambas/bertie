import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import Text from 'components/Text';

import { translations } from 'locales/translations';

import { ReadingInsights } from './computeInsights';
import { FictionSection, RankedSection } from './parts';
import { useInsightsSummary } from './useInsightsSummary';

/** Insights on phones and the PWA: the summary, then one list after another. */
export const MobileInsights = ({ insights }: { insights: ReadingInsights }) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { summary, counts } = useInsightsSummary(insights);

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
        title={t(translations.discover.insights.decades)}
        subtitle={t(translations.discover.insights.decadesSubtitle)}
        groups={insights.decades}
        variant="mobile"
      />
      <FictionSection insights={insights} variant="mobile" />
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
