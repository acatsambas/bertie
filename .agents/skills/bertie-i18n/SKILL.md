---
name: bertie-i18n
description: Use when adding or editing user-facing copy, locales, or useTranslation in Bertie.
---

# Bertie — i18n

- Strings live under `src/locales/en/`.
- Use `useTranslation` / `t('…')` from react-i18next in UI.
- Do not hard-code user-facing English in screens/components when a locale key exists or should exist.
- EN only today; keep keys stable and nested consistently with existing files.
