---
name: bertie-pnpm
description: Use when installing deps, running scripts, pnpm check, secrets, or conventional commits in Bertie.
---

# Bertie — pnpm

Package manager is **pnpm** (`packageManager` in `package.json`). Do not use yarn or npm.

```bash
pnpm install
pnpm check          # oxfmt --check + knip + oxlint + tsc
pnpm fix            # oxlint --fix + oxfmt
pnpm dev            # Firebase emulators + Expo web
pnpm web
pnpm build:web
pnpm secrets:decrypt
pnpm secrets:encrypt
```

## Dependencies

- Prefer **latest** when adding or upgrading (`pnpm add pkg@latest`). Pin exact versions (`saveExact: true`).
- Expo SDK packages: use `npx expo install <pkg>` for compatibility, still taking the newest Expo allows.
- Only pin older versions when peers/Expo/breaking APIs force it.

Secrets: GPG via `.env.gpg` and `.github/scripts/{decrypt,encrypt}.sh`. Set `SECRETS_PASSPHRASE` before decrypt.

Lefthook runs lint-staged on pre-commit and commitlint on commit-msg. Use conventional commits (`feat:`, `fix:`, `chore:`, …).
