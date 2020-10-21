const { dirname, basename } = require('path');

const makeDefaultConfig = require('../../jest/make-default-config');

const { testPathIgnorePatterns, ...base } = makeDefaultConfig(
  dirname(__dirname),
  basename(__dirname),
);

module.exports = {
  ...base,

  rootDir: __dirname,
  displayName: 'integration-test-asap-server',

  testMatch: ['**/*integration.test.{js,jsx,ts,tsx}'],
};
