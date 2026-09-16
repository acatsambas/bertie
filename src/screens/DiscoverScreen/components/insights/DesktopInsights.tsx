import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import Text from 'components/Text';

import { translations } from 'locales/translations';

import { OthersStatus, RatingsSection } from './RatingsSection';
import {
  InsightGroup,
  Ranking,
  RatingComparison,
  ReadingInsights,
  byCentury,
} from './computeInsights';
import {
  FictionSection,
  MAX_RATING,
  PendingLookups,
  RankedSection,
  formatRating,
} from './parts';
import { useInsightsSummary } from './useInsightsSummary';

const COLUMN_MAX_HEIGHT = 140;

/** The top five centuries as columns, tallest for whatever they're ranked by. */
const CenturyColumns = ({
  groups,
  ranking,
}: {
  groups: InsightGroup[];
  ranking: Ranking;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const byRating = ranking === 'topRated';
  const maxReads = Math.max(...groups.map(group => group.readCount));

  return (
    <View style={styles.columns}>
      {groups.map(group => {
        const share = byRating
          ? (group.avgRating ?? 0) / MAX_RATING
          : group.readCount / maxReads;
        const rating =
          group.avgRating === null
            ? t(translations.discover.insights.notRated)
            : t(translations.discover.insights.avg, {
                rating: formatRating(group.avgRating),
              });
        const reads = t(translations.discover.insights.reads, {
          count: group.readCount,
        });

        return (
          <View key={group.label} style={styles.column}>
            <View style={styles.columnPlot}>
              <Text kind="description" text={byRating ? rating : reads} />
              <View
                style={[
                  styles.columnBar,
                  { height: Math.max(4, share * COLUMN_MAX_HEIGHT) },
                ]}
              />
            </View>
            <View style={styles.columnFoot}>
              <Text
                kind="description"
                text={group.label}
                style={[styles.medium, styles.centred]}
              />
              <Text
                kind="littleText"
                text={byRating ? reads : rating}
                color={theme.colors.grey2}
                style={styles.centred}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const Stat = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.stat}>
      <Text kind="littleText" text={label} color={theme.colors.grey2} />
      <View style={styles.statValue}>
        <Text kind="bigHeader" text={value} style={styles.statNumber} />
        {unit && (
          <Text kind="description" text={unit} color={theme.colors.grey2} />
        )}
      </View>
    </View>
  );
};

/**
 * Insights on desktop: the summary as a headline over a row of totals, then
 * the four breakdowns as cards, two to a row.
 */
export const DesktopInsights = ({
  insights,
  pendingCount,
  ratings,
}: {
  insights: ReadingInsights;
  pendingCount: number;
  ratings: { comparison: RatingComparison; othersStatus: OthersStatus };
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { summary, pending } = useInsightsSummary(insights, pendingCount);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {!!summary && (
        <Text kind="header" text={summary} style={styles.summary} />
      )}
      {!!pending && <PendingLookups text={pending} />}
      <View style={styles.stats}>
        <Stat
          label={t(translations.discover.insights.booksRead)}
          value={`${insights.readCount}`}
        />
        <Stat
          label={t(translations.discover.insights.booksRated)}
          value={`${insights.ratedCount}`}
        />
        <Stat
          label={t(translations.discover.insights.averageRating)}
          value={
            insights.avgRating === null ? '–' : formatRating(insights.avgRating)
          }
          unit={t(translations.discover.insights.outOf)}
        />
      </View>
      <View style={styles.cards}>
        <RankedSection
          title={t(translations.discover.insights.authors)}
          groups={insights.authors}
          variant="desktop"
          style={styles.card}
        />
        <RankedSection
          title={t(translations.discover.insights.genres)}
          groups={insights.genres}
          variant="desktop"
          style={styles.card}
        />
        <RankedSection
          title={t(translations.discover.insights.centuries)}
          subtitle={t(translations.discover.insights.centuriesSubtitle)}
          groups={insights.centuries}
          variant="desktop"
          sortShown={byCentury}
          showAll
          style={styles.card}
          renderChart={(ranked, ranking) => (
            <CenturyColumns groups={ranked} ranking={ranking} />
          )}
        />
        <FictionSection
          insights={insights}
          variant="desktop"
          style={styles.card}
        />
        <RatingsSection
          comparison={ratings.comparison}
          othersStatus={ratings.othersStatus}
          variant="desktop"
          style={styles.card}
        />
      </View>
    </ScrollView>
  );
};

const useStyles = makeStyles(theme => ({
  container: { flex: 1 },
  content: {
    paddingTop: 28,
    paddingBottom: 40,
    gap: 28,
  },
  summary: {
    maxWidth: 760,
    fontSize: 28,
    lineHeight: 38,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flex: 1,
    maxWidth: 220,
    gap: 4,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.grey0,
    backgroundColor: '#FFFFFF',
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  statNumber: { lineHeight: 44 },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  card: {
    flexGrow: 1,
    flexBasis: 360,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.grey0,
    backgroundColor: '#FFFFFF',
  },
  columns: {
    flexDirection: 'row',
    gap: 12,
  },
  column: { flex: 1 },
  // A fixed height, so every bar sits on the same baseline and the labels
  // below all start level, whether or not a label wraps onto two lines.
  columnPlot: {
    height: COLUMN_MAX_HEIGHT + 24,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  columnBar: {
    width: '100%',
    maxWidth: 48,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  columnFoot: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 2,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey0,
  },
  medium: { fontFamily: 'Commissioner_500Medium' },
  centred: { textAlign: 'center' },
}));

export default DesktopInsights;
