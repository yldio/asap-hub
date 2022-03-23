const { dirname, basename } = require('path');

const makeDefaultConfig = require('../../jest/make-default-config');

const { setupFilesAfterEnv, testEnvironment, testPathIgnorePatterns, ...base } =
  makeDefaultConfig(dirname(__dirname), basename(__dirname));

module.exports = {
  ...base,

  rootDir: __dirname,
  displayName: 'browser-test-gp2-components',

  preset: 'jest-playwright-jsdom',

  setupFilesAfterEnv: [
    ...(this.setupFilesAfterEnv || []),
    require.resolve('./jest/global-styles-setup-after-env.js'),
  ],

  testMatch: ['**/*.browser-test.{js,jsx,ts,tsx}'],
};
