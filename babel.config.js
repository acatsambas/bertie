module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json',
          ],
          alias: {
            components: './components',
            api: './api',
            assets: './assets',
            lib: './lib',
            gpt: './gpt',
            navigation: './navigation',
            screens: './screens',
            styles: './styles',
            utils: './utils',
            locales: './locales',
          },
        },
      ],
    ],
  };
};
