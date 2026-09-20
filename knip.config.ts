import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  workspaces: {
    '.': {
      entry: [
        'App.ts',
        'src/**/*.{ts,tsx}',
        'scripts/**/*.{ts,mjs,js}',
        'oxlint.config.mjs',
      ],
      project: ['src/**/*.{ts,tsx}', 'scripts/**/*.{ts,mjs,js}'],
      ignoreDependencies: [
        'react-native-web',
        '@babel/core',
        'expo-updates',
        'expo-system-ui',
        'eslint-plugin-expo',
      ],
    },
  },
  rules: {
    duplicates: 'off',
  },
};

export default config;
