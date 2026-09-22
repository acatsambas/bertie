import { defineConfig } from 'oxlint';
import native from 'oxlint-config-universe/native';

export default defineConfig({
  extends: [native],
  ignorePatterns: [
    '**/node_modules/**',
    'dist/**',
    '**/.expo/**',
    '.github/**',
    'oxlint.config.mjs',
    'knip.config.ts',
    'public/**',
  ],
  rules: {
    'expo/use-dom-exports': 'error',
    'expo/no-env-var-destructuring': 'error',
    'expo/no-dynamic-env-var': 'error',
    'import/export': 'off',
    'react/jsx-boolean-value': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-fragments': 'off',
    'react/self-closing-comp': 'off',
  },
  jsPlugins: ['eslint-plugin-expo'],
});
