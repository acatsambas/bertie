import { makeStyles, useTheme } from '@rneui/themed';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  DimensionValue,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import Text from 'components/Text';

import { translations } from 'locales/translations';

import {
  InsightGroup,
  Kind,
  Ranking,
  ReadingInsights,
  rank,
} from './computeInsights';

/** Ratings run from 1 to 4, so every average is out of this. */
export const MAX_RATING = 4;

export const KIND_COLORS: Record<Kind, string> = {
  fiction: '#565EAF',
  nonFiction: '#A85C42',
};

const KINDS: Kind[] = ['fiction', 'nonFiction'];
const RANKINGS: Ranking[] = ['mostRead', 'topRated'];

export type InsightsVariant = 'mobile' | 'desktop';

export const formatRating = (rating: number) => rating.toFixed(1);

const percent = (share: number): DimensionValue => `${share * 100}%`;

const SegmentedToggle = ({
  value,
  onChange,
}: {
  value: Ranking;
  onChange(value: Ranking): void;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.segmented} accessibilityRole="tablist">
      {RANKINGS.map(ranking => {
        const selected = ranking === value;

        return (
          <Pressable
            key={ranking}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(ranking)}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Text
              kind="littleText"
              text={t(translations.discover.insights[ranking])}
              color={selected ? theme.colors.secondary : theme.colors.grey2}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

/**
 * One bar per group. The bar tracks whichever figure the list is ranked by:
 * reads against the most-read group, or the average rating out of 4.
 */
const RankedBars = ({
  groups,
  ranking,
  variant,
  numbered,
}: {
  groups: InsightGroup[];
  ranking: Ranking;
  variant: InsightsVariant;
  /** Whether rows are in ranked order, so a position number means something. */
  numbered: boolean;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const maxReads = Math.max(...groups.map(group => group.readCount));

  return (
    <View style={styles.bars}>
      {groups.map((group, index) => {
        const reads = t(translations.discover.insights.reads, {
          count: group.readCount,
        });
        const rating =
          group.avgRating === null
            ? t(translations.discover.insights.notRated)
            : t(translations.discover.insights.avg, {
                rating: formatRating(group.avgRating),
              });
        const byRating = ranking === 'topRated';
        const share = byRating
          ? (group.avgRating ?? 0) / MAX_RATING
          : group.readCount / maxReads;
        const [primary, secondary] = byRating
          ? [rating, reads]
          : [reads, rating];
        const bar = (
          <View style={styles.track}>
            <View style={[styles.fill, { width: percent(share) }]} />
          </View>
        );

        if (variant === 'desktop') {
          return (
            <View key={group.label} style={styles.inlineRow}>
              {numbered && (
                <Text
                  kind="description"
                  text={`${index + 1}`}
                  color={theme.colors.grey2}
                  style={styles.rank}
                />
              )}
              <Text
                kind="description"
                text={group.label}
                numberOfLines={1}
                style={styles.inlineLabel}
              />
              <View style={styles.inlineBar}>{bar}</View>
              <Text
                kind="description"
                text={primary}
                style={styles.primaryValue}
              />
              <Text
                kind="littleText"
                text={secondary}
                color={theme.colors.grey2}
                style={styles.secondaryValue}
              />
            </View>
          );
        }

        return (
          <View key={group.label} style={styles.stackedRow}>
            <View style={styles.stackedTop}>
              <Text
                kind="description"
                text={numbered ? `${index + 1}. ${group.label}` : group.label}
                numberOfLines={1}
                style={styles.stackedLabel}
              />
              <Text
                kind="littleText"
                text={`${primary} · ${secondary}`}
                color={theme.colors.grey2}
              />
            </View>
            {bar}
          </View>
        );
      })}
    </View>
  );
};

/**
 * A titled top five that can be ranked by reads or by rating. Bars by
 * default; `renderChart` swaps in another picture of the same five, and
 * `sortShown` puts them in a fixed order whichever way they were picked.
 */
export const RankedSection = ({
  title,
  subtitle,
  groups,
  variant,
  style,
  renderChart,
  sortShown,
  showAll,
}: {
  title: string;
  subtitle?: string;
  groups: InsightGroup[];
  variant: InsightsVariant;
  style?: StyleProp<ViewStyle>;
  renderChart?(ranked: InsightGroup[], ranking: Ranking): ReactNode;
  sortShown?(a: InsightGroup, b: InsightGroup): number;
  /** Show every group rather than the top five. */
  showAll?: boolean;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [ranking, setRanking] = useState<Ranking>('mostRead');
  const top = rank(groups, ranking, showAll ? groups.length : undefined);
  const ranked = sortShown ? [...top].sort(sortShown) : top;

  const renderBody = () => {
    if (!groups.length || !ranked.length) {
      return (
        <Text
          kind="description"
          text={t(
            groups.length
              ? translations.discover.insights.noRatings
              : translations.discover.insights.noData,
          )}
          color={theme.colors.grey2}
        />
      );
    }

    return renderChart ? (
      renderChart(ranked, ranking)
    ) : (
      <RankedBars
        groups={ranked}
        ranking={ranking}
        variant={variant}
        numbered={!sortShown}
      />
    );
  };

  return (
    <View style={[styles.section, style]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitle}>
          <Text kind="header" text={title} />
          {subtitle && (
            <Text
              kind="littleText"
              text={subtitle}
              color={theme.colors.grey2}
            />
          )}
        </View>
        {groups.length > 0 && (
          <SegmentedToggle value={ranking} onChange={setRanking} />
        )}
      </View>
      {renderBody()}
    </View>
  );
};

export const FictionSection = ({
  insights,
  variant,
  style,
}: {
  insights: ReadingInsights;
  variant: InsightsVariant;
  style?: StyleProp<ViewStyle>;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { unclassifiedCount } = insights;
  const total = insights.fiction.readCount + insights.nonFiction.readCount;
  const isDesktop = variant === 'desktop';

  const renderKind = (kind: Kind) => {
    const group = insights[kind];
    const share = Math.round((group.readCount / total) * 100);
    const rating =
      group.avgRating === null
        ? t(translations.discover.insights.notRated)
        : t(
            isDesktop
              ? translations.discover.insights.avgLong
              : translations.discover.insights.avg,
            { rating: formatRating(group.avgRating) },
          );

    return (
      <View key={kind} style={styles.kind}>
        <View style={styles.kindName}>
          <View
            style={[styles.swatch, { backgroundColor: KIND_COLORS[kind] }]}
          />
          <Text
            kind="description"
            text={t(translations.discover.insights[kind])}
            style={styles.medium}
          />
        </View>
        {isDesktop && (
          <Text
            kind="bigHeader"
            text={`${group.readCount}`}
            style={styles.kindCount}
          />
        )}
        <Text
          kind="description"
          text={
            isDesktop
              ? t(translations.discover.insights.percentOfReading, {
                  percent: share,
                })
              : `${t(translations.discover.insights.reads, {
                  count: group.readCount,
                })} · ${share}%`
          }
        />
        <Text kind="description" text={rating} color={theme.colors.grey2} />
      </View>
    );
  };

  return (
    <View style={[styles.section, style]}>
      <Text
        kind="header"
        text={t(translations.discover.insights.fictionSplit)}
      />
      {total === 0 ? (
        <Text
          kind="description"
          text={t(translations.discover.insights.noData)}
          color={theme.colors.grey2}
        />
      ) : (
        <>
          <View style={[styles.split, isDesktop && styles.splitDesktop]}>
            {KINDS.filter(kind => insights[kind].readCount > 0).map(kind => (
              <View
                key={kind}
                style={{
                  flex: insights[kind].readCount,
                  backgroundColor: KIND_COLORS[kind],
                }}
              />
            ))}
          </View>
          <View style={styles.kinds}>{KINDS.map(renderKind)}</View>
        </>
      )}
      {unclassifiedCount > 0 && (
        <Text
          kind="littleText"
          text={t(
            unclassifiedCount === 1
              ? translations.discover.insights.unclassifiedOne
              : translations.discover.insights.unclassifiedOther,
            { count: unclassifiedCount },
          )}
          color={theme.colors.grey2}
        />
      )}
    </View>
  );
};

/** "Looking up 12 more books…", while genres and dates are still coming in. */
export const PendingLookups = ({ text }: { text: string }) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.pending}>
      <ActivityIndicator size="small" color={theme.colors.grey2} />
      <Text kind="littleText" text={text} color={theme.colors.grey2} />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  pending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: { gap: 16 },
  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: { gap: 2 },
  segmented: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 8,
    backgroundColor: theme.colors.grey0,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  segmentSelected: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
  },
  bars: { gap: 14 },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: theme.colors.grey0,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  stackedRow: { gap: 6 },
  stackedTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  stackedLabel: {
    flexShrink: 1,
    fontFamily: 'Commissioner_500Medium',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rank: { width: 14 },
  inlineLabel: {
    width: '34%',
    fontFamily: 'Commissioner_500Medium',
  },
  inlineBar: { flex: 1 },
  primaryValue: { width: 64, textAlign: 'right' },
  secondaryValue: { width: 60, textAlign: 'right' },
  split: {
    flexDirection: 'row',
    gap: 2,
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  splitDesktop: {
    height: 16,
    borderRadius: 8,
  },
  kinds: {
    flexDirection: 'row',
    gap: 16,
  },
  kind: { flex: 1, gap: 4 },
  kindName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  medium: { fontFamily: 'Commissioner_500Medium' },
  kindCount: { fontSize: 44, lineHeight: 50 },
}));
