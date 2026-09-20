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
pnpm web
pnpm build:web
pnpm secrets:decrypt
pnpm secrets:encrypt
```

Secrets: GPG via `.env.gpg` and `.github/scripts/{decrypt,encrypt}.sh`. Set `SECRETS_PASSPHRASE` before decrypt.

Lefthook runs lint-staged on pre-commit and commitlint on commit-msg. Use conventional commits (`feat:`, `fix:`, `chore:`, …).
