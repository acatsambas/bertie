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
      paths: {
        'components/*': ['./src/components/*'],
        'api/*': ['./src/api/*'],
        'assets/*': ['./src/assets/*'],
        'lib/*': ['./src/lib/*'],
        'gpt/*': ['./src/gpt/*'],
        'navigation/*': ['./src/navigation/*'],
        'screens/*': ['./src/screens/*'],
        'styles/*': ['./src/styles/*'],
        'utils/*': ['./src/utils/*'],
        'locales/*': ['./src/locales/*'],
        'contexts/*': ['./src/contexts/*'],
        'hooks/*': ['./src/hooks/*'],
      },
      ignoreDependencies: [
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
