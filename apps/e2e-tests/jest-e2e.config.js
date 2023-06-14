const { dirname, basename } = require('path');

const makeDefaultConfig = require('../../jest/make-default-config');

const { testPathIgnorePatterns, ...base } = makeDefaultConfig(
  dirname(__dirname),
  basename(__dirname),
);

module.exports = {
  ...base,

  rootDir: `${__dirname}/tests/crn-server`,
  displayName: 'test-e2e-tests',

  testMatch: ['**/*.e2e-test.{js,jsx,ts,tsx}'],
};
