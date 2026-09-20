import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DimensionValue, StyleProp, View, ViewStyle } from 'react-native';

import Text from 'components/Text';
import { translations } from 'locales/translations';

import { RatingComparison, RatingDistribution } from './computeInsights';
import { InsightsVariant, PendingLookups, formatRating } from './parts';

/** Other readers, beside the reader's own indigo. Checked for colour-blind separation on the white card. */
export const OTHER_READERS_COLOR = '#A85C42';

/** Whether other readers' ratings are here, still loading, or out of reach (guests). */
export type OthersStatus = 'ready' | 'loading' | 'unavailable';

const LEVELS = [1, 2, 3, 4] as const;
const COLUMN_MAX_HEIGHT = 140;
// Differences smaller than this are noise, not a habit.
const SAME_WITHIN = 0.15;

const shareAt = ({ counts, total }: RatingDistribution, index: number) =>
  total ? counts[index] / total : 0;

const percentText = (share: number) => `${Math.round(share * 100)}%`;

const width = (share: number): DimensionValue => `${share * 100}%`;

/**
 * The reader's ratings as a share of their rated books at each of Bertie's
 * four levels, beside other readers' ratings of the same books. Columns on
 * desktop, bars under each level on mobile.
 */
export const RatingsSection = ({
  comparison,
  othersStatus,
  variant,
  style,
}: {
  comparison: RatingComparison;
  othersStatus: OthersStatus;
  variant: InsightsVariant;
  style?: StyleProp<ViewStyle>;
}) => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const labels = translations.discover.insights;
  const { mine, others, enoughOthers, averageDifference } = comparison;
  const showOthers = othersStatus === 'ready' && enoughOthers;
  const meanings = [
    labels.ratingShort1,
    labels.ratingShort2,
    labels.ratingShort3,
    labels.ratingShort4,
  ];

  const series = [
    {
      key: 'you',
      name: t(labels.you),
      color: theme.colors.primary,
      dist: mine,
    },
    ...(showOthers
      ? [
          {
            key: 'others',
            name: t(labels.otherReaders),
            color: OTHER_READERS_COLOR,
            dist: others,
          },
        ]
      : []),
  ];
  // Scaled to the tallest bar, so the shape of both distributions shows.
  const maxShare = Math.max(
    ...series.flatMap(({ dist }) => LEVELS.map((_, i) => shareAt(dist, i))),
    0.01,
  );

  const barLabel = (name: string, share: number, index: number) =>
    t(labels.ratingsBar, {
      who: name,
      percent: Math.round(share * 100),
      rating: LEVELS[index],
      meaning: t(meanings[index]),
    });

  const renderHeadline = () => {
    if (othersStatus === 'loading') {
      return <PendingLookups text={t(labels.ratingsComparing)} />;
    }
    if (othersStatus !== 'ready') return null;
    if (!enoughOthers) {
      return (
        <Text
          kind="description"
          text={t(labels.ratingsNotEnough)}
          color={theme.colors.grey2}
        />
      );
    }
    if (averageDifference === null) return null;

    const difference = Math.abs(averageDifference);
    return (
      <Text
        kind="paragraph"
        text={t(
          difference < SAME_WITHIN
            ? labels.ratingsSame
            : averageDifference > 0
              ? labels.ratingsHigher
              : labels.ratingsLower,
          { difference: formatRating(difference) },
        )}
      />
    );
  };

  const renderLegend = () =>
    series.length > 1 && (
      <View style={styles.legend}>
        {series.map(({ key, name, color }) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: color }]} />
            <Text kind="littleText" text={name} />
          </View>
        ))}
      </View>
    );

  const renderColumns = () => (
    <View style={styles.columns}>
      {LEVELS.map((level, index) => (
        <View key={level} style={styles.group}>
          <View style={styles.groupBars}>
            {series.map(({ key, name, color, dist }) => {
              const share = shareAt(dist, index);

              return (
                <View
                  key={key}
                  style={styles.columnSlot}
                  accessible
                  accessibilityLabel={barLabel(name, share, index)}
                >
                  <Text kind="littleText" text={percentText(share)} />
                  <View
                    style={[
                      styles.column,
                      {
                        height: Math.max(
                          2,
                          (share / maxShare) * COLUMN_MAX_HEIGHT,
                        ),
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.groupFoot}>
            <Text kind="description" text={`${level}`} style={styles.medium} />
            <Text
              kind="littleText"
              text={t(meanings[index])}
              color={theme.colors.grey2}
              style={styles.centred}
            />
          </View>
        </View>
      ))}
    </View>
  );

  const renderBars = () => (
    <View style={styles.levels}>
      {LEVELS.map((level, index) => (
        <View key={level} style={styles.level}>
          <Text
            kind="description"
            text={`${level} · ${t(meanings[index])}`}
            style={styles.medium}
          />
          {series.map(({ key, name, color, dist }) => {
            const share = shareAt(dist, index);

            return (
              <View
                key={key}
                style={styles.barLine}
                accessible
                accessibilityLabel={barLabel(name, share, index)}
              >
                <View style={styles.barSpace}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: width(share / maxShare),
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>
                <Text
                  kind="littleText"
                  text={percentText(share)}
                  style={styles.barValue}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.section, style]}>
      <View style={styles.title}>
        <Text kind="header" text={t(labels.ratingsTitle)} />
        {showOthers && (
          <Text
            kind="littleText"
            text={t(labels.ratingsSubtitle)}
            color={theme.colors.grey2}
          />
        )}
      </View>
      {mine.total === 0 ? (
        <Text
          kind="description"
          text={t(labels.ratingsNone)}
          color={theme.colors.grey2}
        />
      ) : (
        <>
          {renderHeadline()}
          {renderLegend()}
          {variant === 'desktop' ? renderColumns() : renderBars()}
        </>
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  section: { gap: 16 },
  title: { gap: 2 },
  legend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  columns: {
    flexDirection: 'row',
    gap: 12,
  },
  group: {
    flex: 1,
    gap: 8,
  },
  groupBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
    height: COLUMN_MAX_HEIGHT + 20,
  },
  columnSlot: {
    width: 32,
    alignItems: 'center',
    gap: 4,
  },
  column: {
    width: 24,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  groupFoot: {
    alignItems: 'center',
    gap: 2,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey0,
  },
  levels: { gap: 16 },
  level: { gap: 6 },
  barLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barSpace: { flex: 1 },
  bar: {
    minWidth: 2,
    height: 10,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  barValue: { width: 34, textAlign: 'right' },
  medium: { fontFamily: 'Commissioner_500Medium' },
  centred: { textAlign: 'center' },
}));

export default RatingsSection;
