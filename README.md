# Bertie

An app about books (Expo web PWA).

Agent/architecture notes: [`AGENTS.md`](AGENTS.md).

## Setup

```sh
pnpm install
export SECRETS_PASSPHRASE=YOUR-PASSWORD
pnpm secrets:decrypt
pnpm web
```

## Local Firebase

```sh
pnpm dev              # emulators + Expo web (one terminal)
# or separately:
pnpm start:firebase   # terminal 1 — Auth/Firestore emulators + UI :4000
pnpm web:emulators    # terminal 2
```

Details: [`services/firebase/README.md`](services/firebase/README.md).

## Quality

```sh
pnpm check    # format + knip + lint + types
pnpm fix      # auto-fix lint/format
```

## Deploy

Web: Vercel (`pnpm build:web` → `dist/`).

Firestore rules: `pnpm deploy:rules`.

```sh
pnpm build:web
npx serve dist
```
