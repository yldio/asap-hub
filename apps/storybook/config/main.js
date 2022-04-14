module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    require.resolve('@storybook/addon-knobs/register'),
    require.resolve('@storybook/addon-actions/register'),
    require.resolve('storybook-addon-designs/register'),

    require.resolve('@storybook/addon-viewport/register'),
  ],
  babel: async (options) => ({
    ...options,
    presets: [
      ...options.presets,
      ['babel-preset-react-app', { runtime: 'automatic' }],
    ],
  }),
};
