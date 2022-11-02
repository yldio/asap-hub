const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  core: {
    builder: '@storybook/builder-webpack5',
  },
  addons: [
    '@storybook/addon-knobs',
    '@storybook/addon-actions',
    'storybook-addon-designs',
    '@storybook/addon-viewport',
  ],

  babel: async (options) => ({
    ...options,
    presets: [
      ...options.presets,
      ['babel-preset-react-app', { runtime: 'automatic' }],
    ],
  }),
  /*
    Adds this to support git worktree

    Storybook includes a webpack babel-loader to handle TypeScript and/or JSX files.
    The issue is with how Storybook determines the project root, which is the path that the babel-loader includes by default.

    When calculating the project root, Storybook first searches for the closest parent .git folder.
    - https://darekkay.com/blog/storybook-separate-folder/
  */
  webpackFinal: async (config) => {
    const rules = config.module.rules.map((rule) => {
      if (rule.test.toString() === /\.(mjs|tsx?|jsx?)$/.toString()) {
        rule.include = path.resolve(__dirname, '../');
      }
      return rule;
    });

    config.module.rules = rules;
    return config;
  },
};
