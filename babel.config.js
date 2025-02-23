module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
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
            components: './src/components',
            api: './src/api',
            assets: './src/assets',
            lib: './src/lib',
            gpt: './src/gpt',
            navigation: './src/navigation',
            screens: './src/screens',
            styles: './src/styles',
            utils: './src/utils',
            locales: './src/locales',
          },
        },
      ],
    ],
  };
};
