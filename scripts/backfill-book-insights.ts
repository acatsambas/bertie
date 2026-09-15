/**
 * Looks up genres and first publication year for books whose shared
 * `books/{id}` document has no `insights` yet, and saves them there, so the
 * Insights tab never has to wait on them. Uses the app's own lookups.
 *
 * By default only books someone has finished (ticked as read, or rated),
 * since those are the only ones Insights shows; newer ones are looked up by
 * the app as they're read, rated or imported.
 *
 * Usage:
 *   npx tsx scripts/backfill-book-insights.ts [service-account.json] [--all] [--dry-run]
 *
 *   --all      also books nobody has finished yet (more Google quota)
 *   --dry-run  only count what would be looked up; needs no Google key
 *
 * The Google Books key comes from EXPO_PUBLIC_BOOKS_API_KEY, or the repo's
 * decrypted .env. The service account falls back to
 * GOOGLE_APPLICATION_CREDENTIALS, then any *-firebase-adminsdk-*.json or
 * bertie-*.json in the repo root, like the other admin scripts.
 *
 * Each book costs one call from the app's Google Books quota (plus one or
 * two to Open Library), so run it when search is quiet. If the quota runs
 * out it stops early; run it again once it resets to finish.
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { fetchBookInsightsMeta } from '../src/api/google-books/fetchBookInsightsMeta';
import { mapWithLimit } from '../src/utils/mapWithLimit';

const ROOT = join(__dirname, '..');
const CONCURRENCY = 4;
const ATTEMPTS = 3;

const args = process.argv.slice(2);
const flags = new Set(args.filter(arg => arg.startsWith('--')));
const credentialArg = args.find(arg => !arg.startsWith('--'));

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const loadBooksKey = () => {
  if (process.env.EXPO_PUBLIC_BOOKS_API_KEY) return true;

  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return false;

  const line = readFileSync(envPath, 'utf8')
    .split('\n')
    .find(entry => entry.trim().startsWith('EXPO_PUBLIC_BOOKS_API_KEY='));
  if (!line) return false;

  process.env.EXPO_PUBLIC_BOOKS_API_KEY = line
    .slice(line.indexOf('=') + 1)
    .trim()
    .replace(/^["']|["']$/g, '');
  return true;
};

const findCredentialPath = () => {
  if (credentialArg) return credentialArg;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return undefined;

  const file = readdirSync(ROOT).find(
    name =>
      /-firebase-adminsdk-.*\.json$/.test(name) ||
      /^bertie-.*\.json$/.test(name),
  );
  return file && join(ROOT, file);
};

/** Books ticked as read on anyone's list, or rated by anyone. */
const finishedBookIds = async (db: Firestore) => {
  const ids = new Set<string>();
  const users = await db.collection('users').listDocuments();

  await mapWithLimit(users, 10, async user => {
    const read = await user
      .collection('books')
      .where('isRead', '==', true)
      .get();
    read.docs.forEach(entry => ids.add(entry.id));
  });
  (await db.collection('ratings').get()).docs.forEach(rating => {
    const { bookId } = rating.data();
    if (bookId) ids.add(bookId);
  });

  return ids;
};

const isQuotaError = (error: unknown) => String(error).includes(': 429');

const lookUp = async (bookId: string) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetchBookInsightsMeta(bookId);
    } catch (error) {
      if (attempt === ATTEMPTS) throw error;
      // A 429 may just be a per-minute limit, so give it longer.
      await sleep((isQuotaError(error) ? 10_000 : 1_500) * attempt);
    }
  }
};

const main = async () => {
  const dryRun = flags.has('--dry-run');
  const all = flags.has('--all');

  if (!dryRun && !loadBooksKey()) {
    console.error(
      'No Google Books key: set EXPO_PUBLIC_BOOKS_API_KEY, or decrypt .env first.',
    );
    process.exit(1);
  }

  const credentialPath = findCredentialPath();
  initializeApp(
    credentialPath ? { credential: cert(credentialPath) } : undefined,
  );
  const db = getFirestore();

  const books = await db.collection('books').get();
  const wanted = all ? null : await finishedBookIds(db);
  const cached = books.docs.filter(book => book.data().insights).length;
  const todo = books.docs
    .filter(book => !book.data().insights && (!wanted || wanted.has(book.id)))
    .map(book => book.id);

  console.log(
    `${books.size} books in the catalogue, ${cached} already looked up. ` +
      `${todo.length} to look up${all ? '' : ' (finished books only; --all for the rest)'}.`,
  );
  if (dryRun || !todo.length) return;

  let done = 0;
  let saved = 0;
  let failed = 0;
  let quotaReached = false;

  await mapWithLimit(todo, CONCURRENCY, async id => {
    if (quotaReached) return;

    try {
      const { meta } = await lookUp(id);
      await db.doc(`books/${id}`).update({ insights: meta });
      saved += 1;
    } catch (error) {
      failed += 1;
      if (isQuotaError(error)) quotaReached = true;
      else console.warn(`  ${id}: ${error}`);
    }

    done += 1;
    if (done % 25 === 0) console.log(`  ${done}/${todo.length}`);
  });

  console.log(`Done: ${saved} looked up and saved, ${failed} failed.`);
  if (quotaReached) {
    console.log(
      'Stopped early: the Google Books quota ran out. Run it again once it resets to finish the rest.',
    );
  }
};

void main();
