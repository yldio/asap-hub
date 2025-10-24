import { StorybookConfig } from '@storybook/react-vite';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],

  core: {
    builder: getAbsolutePath('@storybook/builder-vite'), // 👈 The builder enabled here.
  },

  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    '@storybook/addon-docs',
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
};
export default config;

// function value: string): any {
//   return dirname(require.resolve(join(value, "package.json")));
// }

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
