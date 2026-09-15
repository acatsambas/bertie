import { useTranslation } from 'react-i18next';

import { translations } from 'locales/translations';

import { Kind, ReadingInsights, summarise } from './computeInsights';

/** The opening sentences, and the "12 books read · 8 rated" line. */
export const useInsightsSummary = (insights: ReadingInsights) => {
  const { t } = useTranslation();
  const labels = translations.discover.insights;

  const kindName = (kind: Kind) =>
    t(kind === 'fiction' ? labels.fictionLower : labels.nonFictionLower);

  const summary = summarise(insights, kindName)
    .map(({ id, values }) => t(labels.summary[id], values))
    .join(' ');

  const counts = [
    t(insights.readCount === 1 ? labels.readCountOne : labels.readCountOther, {
      count: insights.readCount,
    }),
    t(
      insights.ratedCount === 1 ? labels.ratedCountOne : labels.ratedCountOther,
      { count: insights.ratedCount },
    ),
  ].join(' · ');

  return { summary, counts };
};
