---
name: bertie-api-query
description: Use when editing Firebase client setup or React Query domain hooks under src/api.
---

# Bertie — API / React Query

- Firebase app/auth/firestore: `src/api/firebase.ts` (emulator connect when `EXPO_PUBLIC_USE_FIREBASE_EMULATORS=1`).
- Auth provider: `src/api/auth/`.
- Domain hooks: `src/api/app/{book,orders,shops,user}/`.
- Guest mode: `src/api/guest/`.
- Prefer TanStack Query patterns already used in neighboring hooks; do not fetch Firestore directly from screens.
