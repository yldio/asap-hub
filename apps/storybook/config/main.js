const path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    require.resolve('@storybook/addon-knobs/register'),
    require.resolve('@storybook/addon-actions/register'),
    require.resolve('storybook-addon-designs/register'),

    require.resolve('@storybook/addon-viewport/register'),
  ],
  webpackFinal: async (config, { configType }) => {
    // config.module.rules.push({
    //   test: /\.tsx?$/,
    //   exclude: /node_modules/,
    //   use: [
    //     {
    //       loader: require.resolve('babel-loader'),
    //       options: {
    //         presets: [
    //           require('babel-preset-react-app').default,
    //         ],
    //       },
    //     },
    //   ],
    // });

    // config.resolve.extensions.push('.ts', '.tsx');

    // config.module.rules.push({
    //   test: /\.mjs$/,
    //   include: /node_modules/,
    //   type: 'javascript/auto',
    // });

    // config.resolve.extensions.push('.mjs');

    config.resolve.modules = [path.resolve(__dirname, ".."), "node_modules"];

    console.log(`The final webpack config`,  config, configType);
    return config;
  },
};
