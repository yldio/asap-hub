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
  ],

  transform: {
    '^.+\\.css$': [require.resolve('jest-transform-css'), { modules: true }],
    ...transform

  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    ...moduleNameMapper,
    '^.+\\.module\\.(css|sass|scss)$': require.resolve('identity-obj-proxy'),
  },

  displayName: 'test-crn-auth-frontend',
};
