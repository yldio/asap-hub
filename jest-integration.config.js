const {
  testPathIgnorePatterns,
  ...base
} = require('./jest/jest-base.config.js');

module.exports = {
  ...base,
  testMatch: ['<rootDir>/*.integration-test.{js,jsx,ts,tsx}'],
};
