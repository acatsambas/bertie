# Bertie — agent notes

Expo 57 web PWA for books, reading lists, and independent bookshop orders. Single package (not a monorepo). Use **pnpm**.

## Layout

| Path                 | Role                                                              |
| -------------------- | ----------------------------------------------------------------- |
| `src/`               | App code (screens, api, navigation, locales)                      |
| `src/api/`           | Firebase client, auth, React Query domain hooks                   |
| `src/screens/`       | Screen folders (presentational)                                   |
| `src/navigation/`    | Navigators, routes, linking                                       |
| `src/locales/`       | i18n (`en`)                                                       |
| `src/gpt/`           | Discover GPT helper (imported by Discover; web shows store links) |
| `public/`            | Static web assets (marketing/legal HTML, PWA, screenshots)        |
| `services/firebase/` | Firestore rules/indexes + emulator config (not the npm SDK)       |
| `scripts/`           | Admin backfills (`tsx`)                                           |
| `.agents/skills/`    | Project skills                                                    |

## Commands

```bash
pnpm install
pnpm secrets:decrypt          # needs SECRETS_PASSPHRASE
pnpm dev                      # Auth/Firestore emulators + Expo web
pnpm web                      # Expo web (prod Firebase)
pnpm start:firebase           # emulators only
pnpm seed:emulator            # mock London shops into running emulator
pnpm web:emulators            # web only, against emulators
pnpm check                    # format + knip + lint + types
pnpm fix                      # oxlint --fix + oxfmt
pnpm build:web                # expo export → dist/
pnpm deploy:rules             # production Firestore rules/indexes
```

Conventional commits (`feat:`, `fix:`, …) — enforced by commitlint via lefthook.

When adding or upgrading packages, install the **latest** published version and pin it exactly (`saveExact: true`). Use `npx expo install` for Expo SDK packages; only pin older versions when peers/Expo force it.

## Ownership

- Screens stay presentational; data/fetching in `src/api/app/*` React Query hooks.
- User-facing copy goes through i18n (`src/locales`), not hard-coded strings.
- Backend config only under `services/firebase/`; app SDK imports from the `firebase` npm package via `src/api/firebase.ts`.
- Static HTML/CSS/images only under `public/` (Expo copies them on export).

## Local Firebase

See [`services/firebase/README.md`](services/firebase/README.md). Emulator UI: http://127.0.0.1:4000

## Project skills

| Skill                | When to use                                          |
| -------------------- | ---------------------------------------------------- |
| **bertie-pnpm**      | install, scripts, `pnpm check`, secrets, commits     |
| **bertie-screens**   | screen folders + navigation registration             |
| **bertie-api-query** | React Query / `src/api/app/` / Firebase client       |
| **bertie-i18n**      | `src/locales`, `useTranslation`                      |
| **bertie-firebase**  | `services/firebase/` folder, emulators, rules deploy |
