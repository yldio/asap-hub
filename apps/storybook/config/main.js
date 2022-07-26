module.exports = {
  stories: ['../src/**/*.stories.tsx'],
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
};
