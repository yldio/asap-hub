const {
  testPathIgnorePatterns,
  ...base
} = require('./jest/jest-base.config.js');

module.exports = {
  ...base,
  collectCoverageFrom: ['<rootDir>/apps/crn-server/src/**/*.{js,jsx,ts,tsx}'],
  testMatch: ['<rootDir>/**/*.integration-test.{js,jsx,ts,tsx}'],
  setupFilesAfterEnv: [
    '<rootDir>/apps/crn-server/test/integration/setup-jest.js',
  ],
};
