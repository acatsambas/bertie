---
name: bertie-screens
description: Use when adding or editing screens under src/screens or registering routes in src/navigation.
---

# Bertie — screens

- Put UI under `src/screens/<Name>Screen/` (component + local hooks/styles as needed).
- Register routes in `src/navigation/` (`routes.ts`, feature navigators, `RootNavigator`).
- Keep screens presentational; fetch via React Query hooks in `src/api/app/`.
- Prefer existing path aliases (`screens/…`, `components/…`) from `tsconfig` / babel.
