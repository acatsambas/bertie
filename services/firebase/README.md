# Firebase (`services/firebase`)

Backend config for Bertie: Firestore rules/indexes and the Emulator Suite.

This folder is **not** the `firebase` npm package. App code imports the SDK from `src/api/firebase.ts` (`firebase/app`, `firebase/auth`, …).

## Layout

| File                     | Role                                                   |
| ------------------------ | ------------------------------------------------------ |
| `firebase.json`          | Rules/indexes paths + emulator ports                   |
| `.firebaserc`            | `demo-bertie` (default/emulators) + `production` alias |
| `firestore.rules`        | Security rules                                         |
| `firestore.indexes.json` | Composite indexes                                      |
| `seed/shops.json`        | Mock London bookshops for the Firestore emulator       |
| `seed/user.json`         | Dev Auth user + London address for the emulators       |

## Emulator ports

| Service     | Port |
| ----------- | ---- |
| Auth        | 9099 |
| Firestore   | 8080 |
| Emulator UI | 4000 |

## Local development

Requires **Java 21+** for the Emulator Suite (`firebase-tools` 15).

One-shot (emulators + Expo web):

```bash
pnpm dev
```

Or in two terminals:

```bash
pnpm start:firebase
```

In another terminal:

```bash
pnpm web:emulators
```

Emulator UI: http://127.0.0.1:4000

`web:emulators` sets `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=1` so the app connects to Auth/Firestore emulators.

## Emulator seed data

`pnpm dev` runs `seed:emulator` after Auth/Firestore are up. It seeds:

- Mock London bookshops from `seed/shops.json`
- A signed-in-ready Auth user + Firestore profile from `seed/user.json`

Both skip when already present (no duplicates). Dev login (emulators only):

| Field    | Value              |
| -------- | ------------------ |
| Email    | `aris@bertieapp.local` |
| Password | `bertie`               |

```bash
pnpm seed:emulator
```

The script sets `FIRESTORE_EMULATOR_HOST` / `FIREBASE_AUTH_EMULATOR_HOST`, so it cannot write to production.

## Deploy rules

```bash
pnpm deploy:rules
```

Uses the `production` project from `.firebaserc`. Requires Firebase CLI auth (`firebase login`).

## Cloud Functions

Not in this folder yet. Reserved for a later OpenAI proxy / server work.
