const { dirname, basename } = require('path');

const makeDefaultConfig = require('../../jest/make-default-config');

const { testEnvironment, testPathIgnorePatterns, ...base } = makeDefaultConfig(
  dirname(__dirname),
  basename(__dirname),
);

module.exports = {
  ...base,

  rootDir: __dirname,
  displayName: 'browser-test-react-components',

  preset: 'jest-playwright-jsdom',

  testMatch: ['**/*.browser-test.{js,jsx,ts,tsx}'],
};
