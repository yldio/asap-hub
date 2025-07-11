const {
  setupFilesAfterEnv,
  moduleNameMapper,
  transform,
  ...baseConfig
} = require('../../jest/jest-base.config.js');

module.exports = {
  ...baseConfig,

  rootDir: __dirname,
  testEnvironment: 'jsdom',

  setupFiles: [require.resolve('react-app-polyfill/jsdom')],
  setupFilesAfterEnv: [
    ...(setupFilesAfterEnv || []),
    require.resolve('../../jest/dom-extensions-setup-after-env.js'),
    require.resolve('./reset-recoil.js'),
    require.resolve('./extend-timeouts.js'),
  ],

  transform: {
    '^.+\\.css$': [require.resolve('jest-transform-css'), { modules: true }],
    ...transform,
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    ...moduleNameMapper,
    '^@asap-hub/react-components/manuscript-form$':
      '@asap-hub/react-components/src/manuscript-form',
    '^.+\\.module\\.(css|sass|scss)$': require.resolve('identity-obj-proxy'),
    '^csv-stringify/browser/esm': require.resolve('csv-stringify'),
  },
  modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],

  displayName: 'test-frontend',
};
