import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeStyles, useTheme } from '@rneui/themed';
import { useQueryClient } from '@tanstack/react-query';
import { isDesktopPlatform } from 'hooks/useIsDesktop';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, View } from 'react-native';

import {
  GoodreadsImportResult,
  importGoodreadsBooks,
} from 'api/app/book/goodreads/importGoodreadsBooks';
import {
  GoodreadsBook,
  parseGoodreadsCsv,
} from 'api/app/book/goodreads/parseGoodreadsCsv';
import { auth } from 'api/firebase';
import { useGuest } from 'api/guest/GuestProvider';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { SoftCard } from 'components/SoftCard';
import Text from 'components/Text';
import { translations } from 'locales/translations';
import { goBackOrFallback } from 'navigation/goBackOrFallback';
import { Routes } from 'navigation/routes';
import type { NavigationType } from 'navigation/types';
import { SettingsPageShell } from 'screens/SettingsScreen/SettingsPageShell';

import RatingMapping from './RatingMapping';

const GOODREADS_EXPORT_URL = 'https://www.goodreads.com/review/import';
const STEPS = ['step1', 'step2', 'step3', 'step4'] as const;
const REFRESHED_QUERIES = [
  'userBooks',
  'userBooksIds',
  'userBookRating',
  'readingInsights',
];

type Stage =
  | { name: 'choose'; error?: string }
  | { name: 'review'; books: GoodreadsBook[]; fileName: string }
  | { name: 'importing'; done: number; total: number }
  | { name: 'done'; result: GoodreadsImportResult };

// Desktop web only, so the browser's own file picker will do.
const pickFile = () =>
  new Promise<File | null>(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,text/csv';
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });

/** Brings a Goodreads library export into the reader's list. */
const GoodreadsImportScreen = () => {
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<NavigationType>>();
  const queryClient = useQueryClient();
  const onDesktop = isDesktopPlatform();
  const { isGuest } = useGuest();
  const [stage, setStage] = useState<Stage>({ name: 'choose' });
  const labels = translations.goodreadsImport;

  const handleChooseFile = async () => {
    const file = await pickFile();
    if (!file) return;

    try {
      const books = parseGoodreadsCsv(await file.text());
      setStage(
        books.length
          ? { name: 'review', books, fileName: file.name }
          : { name: 'choose', error: t(labels.noBooks) },
      );
    } catch {
      setStage({ name: 'choose', error: t(labels.notGoodreads) });
    }
  };

  const handleImport = async (books: GoodreadsBook[]) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    setStage({ name: 'importing', done: 0, total: books.length });
    try {
      const result = await importGoodreadsBooks(books, userId, done =>
        setStage({ name: 'importing', done, total: books.length }),
      );
      REFRESHED_QUERIES.forEach(
        key => void queryClient.invalidateQueries({ queryKey: [key] }),
      );
      setStage({ name: 'done', result });
    } catch (error) {
      console.warn('Goodreads import failed:', error);
      setStage({ name: 'choose', error: t(labels.failed) });
    }
  };

  const handleGoToList = () =>
    navigation.navigate(Routes.APP_01_HOME, {
      screen: Routes.HOME_01_LIBRARY,
    });

  const renderChoose = (error?: string) => (
    <>
      <SoftCard style={styles.card}>
        <Text kind="paragraph" text={t(labels.intro)} />
        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text
                  kind="description"
                  text={`${index + 1}`}
                  color={theme.colors.white}
                  style={styles.medium}
                />
              </View>
              <Text
                kind="paragraph"
                text={t(labels[step])}
                style={styles.stepText}
              />
            </View>
          ))}
        </View>
        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL(GOODREADS_EXPORT_URL)}
          style={styles.link}
        >
          <Text
            kind="description"
            text={t(labels.openGoodreads)}
            color={theme.colors.primary}
            style={styles.medium}
          />
          <Icon icon="right" color={theme.colors.primary} size={18} />
        </Pressable>
      </SoftCard>
      {error && (
        <View style={styles.error}>
          <Text kind="paragraph" text={error} />
        </View>
      )}
      <Button
        kind="primary"
        icon="import"
        text={t(labels.upload)}
        onPress={handleChooseFile}
      />
      <Text
        kind="description"
        text={t(labels.shelves)}
        color={theme.colors.grey2}
      />
      <RatingMapping />
    </>
  );

  const renderReview = (books: GoodreadsBook[], fileName: string) => {
    const read = books.filter(book => book.isRead).length;

    return (
      <>
        <SoftCard style={styles.card}>
          <Text
            kind="header"
            text={t(books.length === 1 ? labels.foundOne : labels.foundOther, {
              count: books.length,
              fileName,
            })}
          />
          <Text
            kind="paragraph"
            text={t(labels.breakdown, { read, current: books.length - read })}
          />
          <Text
            kind="description"
            text={t(labels.shelves)}
            color={theme.colors.grey2}
          />
        </SoftCard>
        <RatingMapping />
        <Button
          kind="primary"
          text={t(labels.start)}
          onPress={() => handleImport(books)}
        />
        <Button
          kind="tertiary"
          text={t(labels.chooseAnother)}
          onPress={handleChooseFile}
        />
      </>
    );
  };

  const renderImporting = (done: number, total: number) => (
    <SoftCard style={styles.card}>
      <Text kind="header" text={t(labels.importing, { done, total })} />
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${(done / total) * 100}%` as const }]}
        />
      </View>
      <Text
        kind="description"
        text={t(labels.keepOpen)}
        color={theme.colors.grey2}
      />
    </SoftCard>
  );

  const renderDone = ({
    added,
    updated,
    unchanged,
    missed,
  }: GoodreadsImportResult) => (
    <>
      <SoftCard style={styles.card}>
        <Text kind="header" text={t(labels.doneTitle)} />
        <View style={styles.tally}>
          <Text kind="paragraph" text={t(labels.added, { count: added })} />
          {updated > 0 && (
            <Text
              kind="paragraph"
              text={t(labels.updated, { count: updated })}
            />
          )}
          {unchanged > 0 && (
            <Text
              kind="paragraph"
              text={t(labels.unchanged, { count: unchanged })}
            />
          )}
          {missed.length > 0 && (
            <Text
              kind="paragraph"
              text={t(labels.missed, { count: missed.length })}
            />
          )}
        </View>
      </SoftCard>
      {missed.length > 0 && (
        <SoftCard style={styles.card}>
          <Text kind="description" text={t(labels.missedHelp)} />
          <View style={styles.missedList}>
            {missed.map((book, index) => (
              <Text
                key={`${book.title}-${index}`}
                kind="description"
                text={
                  book.author ? `${book.title} — ${book.author}` : book.title
                }
                color={theme.colors.grey2}
              />
            ))}
          </View>
        </SoftCard>
      )}
      <Button
        kind="primary"
        text={t(labels.goToList)}
        onPress={handleGoToList}
      />
    </>
  );

  const renderBody = () => {
    // Reached only through the desktop Settings button, but a link can land
    // anyone here.
    if (!onDesktop)
      return <Text kind="paragraph" text={t(labels.desktopOnly)} />;
    if (isGuest) return <Text kind="paragraph" text={t(labels.needsAccount)} />;

    switch (stage.name) {
      case 'choose':
        return renderChoose(stage.error);
      case 'review':
        return renderReview(stage.books, stage.fileName);
      case 'importing':
        return renderImporting(stage.done, stage.total);
      case 'done':
        return renderDone(stage.result);
    }
  };

  return (
    <SettingsPageShell
      title={t(labels.title)}
      onBack={
        stage.name !== 'importing'
          ? () =>
              goBackOrFallback(navigation, Routes.SETTINGS_05_IMPORT_GOODREADS)
          : undefined
      }
    >
      {renderBody()}
    </SettingsPageShell>
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
  steps: { gap: 12 },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  stepText: { flex: 1, lineHeight: 24 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
  },
  medium: { fontFamily: 'Commissioner_500Medium' },
  error: {
    backgroundColor: '#FDEDED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
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
  tally: { gap: 6 },
  missedList: { gap: 6 },
}));

export default GoodreadsImportScreen;
