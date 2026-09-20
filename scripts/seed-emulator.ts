/**
 * Seeds curated mock data into the local Auth + Firestore emulators.
 *
 * Only writes when emulator hosts are set, so it cannot touch production.
 * Skips shops / the dev user when they already exist (no duplicates).
 *
 * Usage (emulators must already be up):
 *   pnpm seed:emulator
 *
 * Also runs automatically from `pnpm dev` once Auth/Firestore are listening.
 *
 * Dev login: see services/firebase/seed/user.json
 */
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type SeedShop = {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  zipcode: string;
  email: string;
  description: string;
};

type SeedUser = {
  email: string;
  password: string;
  givenName: string;
  familyName: string;
  address: {
    firstLine: string;
    secondLine?: string;
    city: string;
    postcode: string;
    country: string;
  };
};

const ROOT = join(__dirname, '..');
const PROJECT_ID = 'demo-bertie';
const FIRESTORE_HOST = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080';
const AUTH_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? '127.0.0.1:9099';

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIRESTORE_EMULATOR_HOST = FIRESTORE_HOST;
}
if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = AUTH_HOST;
}

const shops = JSON.parse(
  readFileSync(join(ROOT, 'services/firebase/seed/shops.json'), 'utf8'),
) as SeedShop[];
const seedUser = JSON.parse(
  readFileSync(join(ROOT, 'services/firebase/seed/user.json'), 'utf8'),
) as SeedUser;

initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();
const auth = getAuth();

const seedShops = async () => {
  const snapshots = await Promise.all(
    shops.map(shop => db.collection('shops').doc(shop.id).get()),
  );

  const missing = shops.filter((_, index) => !snapshots[index].exists);

  if (missing.length === 0) {
    console.log(
      `Shops already present (${shops.length}), skipping (${FIRESTORE_HOST})`,
    );
    return;
  }

  const batch = db.batch();
  for (const shop of missing) {
    const { id, ...fields } = shop;
    batch.set(db.collection('shops').doc(id), fields);
  }
  await batch.commit();

  console.log(
    `Seeded ${missing.length} of ${shops.length} shops (${FIRESTORE_HOST})`,
  );
};

const seedDevUser = async () => {
  let uid: string;
  let createdAuth = false;

  try {
    const existing = await auth.getUserByEmail(seedUser.email);
    uid = existing.uid;
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? String((error as { code: unknown }).code)
        : '';
    if (code !== 'auth/user-not-found') throw error;

    const created = await auth.createUser({
      email: seedUser.email,
      password: seedUser.password,
      displayName: `${seedUser.givenName} ${seedUser.familyName}`,
      emailVerified: true,
    });
    uid = created.uid;
    createdAuth = true;
  }

  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();

  if (userSnap.exists) {
    console.log(
      createdAuth
        ? `Created Auth user ${seedUser.email}; Firestore profile already present, skipping`
        : `Dev user already present (${seedUser.email}), skipping (${AUTH_HOST})`,
    );
    return;
  }

  await userRef.set({
    documentId: uid,
    email: seedUser.email,
    contactEmail: seedUser.email,
    givenName: seedUser.givenName,
    familyName: seedUser.familyName,
    address: seedUser.address,
  });

  console.log(
    createdAuth
      ? `Seeded Auth + profile for ${seedUser.email} (${AUTH_HOST})`
      : `Seeded Firestore profile for existing ${seedUser.email}`,
  );
};

const seed = async () => {
  await seedShops();
  await seedDevUser();
};

seed().catch(error => {
  console.error('Failed to seed emulator:', error);
  process.exit(1);
});
