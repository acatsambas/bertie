import { makeStyles, useTheme } from '@rneui/themed';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Text from 'components/Text';

import { translations } from 'locales/translations';

// Goodreads stars on the left, the Bertie rating they become on the right.
// Nothing becomes 4: that one is left for the reader to give.
const RATING_MAPPING = [
  { from: 'stars12', rating: 1 },
  { from: 'stars3', rating: 2 },
  { from: 'stars45', rating: 3 },
  { from: 'onlyInBertie', rating: 4 },
] as const;

/** How Goodreads stars become Bertie ratings, with what each rating means. */
const RatingMapping = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const labels = translations.goodreadsImport;
  // The same wording as the rating sheet on a book, so the two can't drift.
  const meanings = [
    translations.library.rating.option1,
    translations.library.rating.option2,
    translations.library.rating.option3,
    translations.library.rating.option4,
  ];

  return (
    <View style={styles.card}>
      <Text kind="header" text={t(labels.ratingsTitle)} />
      <Text kind="description" text={t(labels.ratingsIntro)} />
      <View style={styles.rows}>
        {RATING_MAPPING.map(({ from, rating }) => {
          const fromGoodreads = rating < 4;
          const muted = fromGoodreads ? undefined : theme.colors.grey2;

          return (
            <View key={rating} style={styles.row}>
              <Text
                kind="description"
                text={t(labels[from])}
                color={muted}
                style={[styles.medium, styles.from]}
              />
              <View style={[styles.badge, !fromGoodreads && styles.badgeEmpty]}>
                <Text
                  kind="description"
                  text={`${rating}`}
                  color={
                    fromGoodreads ? theme.colors.white : theme.colors.grey2
                  }
                  style={styles.medium}
                />
              </View>
              <Text
                kind="description"
                text={t(meanings[rating - 1])}
                color={muted}
                style={styles.meaning}
              />
            </View>
          );
        })}
      </View>
      <Text
        kind="description"
        text={t(labels.topRatingNote)}
        color={theme.colors.grey2}
      />
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  card: {
    gap: 16,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.grey0,
    backgroundColor: '#FFFFFF',
  },
  rows: { gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  from: { width: 104, lineHeight: 24 },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  badgeEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.grey2,
  },
  meaning: { flex: 1, lineHeight: 24 },
  medium: { fontFamily: 'Commissioner_500Medium' },
}));

export default RatingMapping;
