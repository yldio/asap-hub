import { StorybookConfig } from '@storybook/react-vite';

import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },

  addons: [
    getAbsolutePath('@storybook/addon-controls'),
    getAbsolutePath('@storybook/addon-actions'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-viewport'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  babel: async (options) => ({
    ...options,
    presets: [
      ...options.presets,
      ['babel-preset-react-app', { runtime: 'automatic' }],
    ],
  }),
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {
      fastRefresh: true,
    },
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
