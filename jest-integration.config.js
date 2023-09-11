const {
  testPathIgnorePatterns,
  ...base
} = require('./jest/jest-base.config.js');

module.exports = {
  ...base,
  collectCoverageFrom: ['<rootDir>/apps/crn-server/src/**/*.{js,jsx,ts,tsx}'],
  testMatch: [
    '<rootDir>/**/common/*.integration-test.{js,jsx,ts,tsx}',
    `<rootDir>/**/contentful/*.integration-test.{js,jsx,ts,tsx}`,
  ],
};
