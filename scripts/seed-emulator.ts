import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
/**
 * Seeds curated mock data into the local Auth + Firestore emulators.
 *
 * Only writes when emulator hosts are set, so it cannot touch production.
 * Shops skip when already present. The dev user is upserted so Auth +
 * Firestore stay aligned with register + address-save (name, emails, address).
 *
 * Usage (emulators must already be up):
 *   pnpm seed:emulator
 *
 * Also runs automatically from `pnpm dev` once Auth/Firestore are listening.
 *
 * Dev login: see services/firebase/seed/user.json
 */
import { format } from 'postal-code-checker';

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
/** Must match `services/firebase/.firebaserc` default and emulator app config. */
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

/**
 * Shape the Firestore profile the same way register (`createUser`) and the
 * address screen (`useUpdateAddressMutation`) would after a successful signup.
 */
const buildUserProfile = (uid: string) => {
  const country = seedUser.address.country.trim().toUpperCase();
  const postcode =
    format(country, seedUser.address.postcode.trim()) ??
    seedUser.address.postcode.trim().toUpperCase();

  return {
    documentId: uid,
    email: seedUser.email,
    contactEmail: seedUser.email,
    givenName: seedUser.givenName,
    familyName: seedUser.familyName,
    address: {
      firstLine: seedUser.address.firstLine.trim(),
      secondLine: (seedUser.address.secondLine ?? '').trim(),
      city: seedUser.address.city.trim(),
      postcode,
      country,
    },
  };
};

const seedDevUser = async () => {
  const displayName =
    `${seedUser.givenName} ${seedUser.familyName}`.trim() || undefined;

  let uid: string;
  let createdAuth = false;

  try {
    const existing = await auth.getUserByEmail(seedUser.email);
    uid = existing.uid;
    await auth.updateUser(uid, {
      password: seedUser.password,
      displayName,
      emailVerified: true,
    });
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? String((error as { code: unknown }).code)
        : '';
    if (code !== 'auth/user-not-found') throw error;

    const created = await auth.createUser({
      email: seedUser.email,
      password: seedUser.password,
      displayName,
      emailVerified: true,
    });
    uid = created.uid;
    createdAuth = true;
  }

  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();
  const profile = buildUserProfile(uid);

  await userRef.set(profile, { merge: true });

  console.log(
    createdAuth
      ? `Seeded Auth + profile for ${seedUser.email} (${AUTH_HOST})`
      : userSnap.exists
        ? `Updated Auth + profile for ${seedUser.email} (${AUTH_HOST})`
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
