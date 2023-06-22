const {
  testPathIgnorePatterns,
  ...base
} = require('./jest/jest-base.config.js');

module.exports = {
  ...base,
  testMatch: [
    '<rootDir>/**/common/*.integration-test.{js,jsx,ts,tsx}',
    `<rootDir>/**/${process.env.INTEGRATION_TEST_CMS}/*.integration-test.{js,jsx,ts,tsx}`,
  ],
};
