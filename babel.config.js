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
            '.web.ts',
            '.web.tsx',
            '.ios.ts',
            '.ios.tsx',
            '.android.ts',
            '.android.tsx',
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
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
