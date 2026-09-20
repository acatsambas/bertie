---
name: bertie-firebase
description: Use when editing services/firebase rules or indexes, starting emulators, or deploying Firestore rules.
---

# Bertie — Firebase

Backend config lives under **`services/firebase/`** (not repo root, not the `firebase` npm package):

- `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`
- Docs: `services/firebase/README.md`

App SDK imports use the **`firebase`** npm package from `src/api/firebase.ts` (`firebase/app`, `firebase/auth`, `firebase/firestore`, …). Do not confuse those with the `services/firebase/` folder.

```bash
pnpm start:firebase      # Auth 9099, Firestore 8080, UI 4000
pnpm web:emulators       # Expo web against emulators
pnpm deploy:rules        # production rules + indexes
```

Do not put rules files back at the repo root.
