const {
  testPathIgnorePatterns,
  ...base
} = require('./jest/jest-base.config.js');

module.exports = {
  ...base,
  testMatch: ['**/*.integration-test.{js,jsx,ts,tsx}'],
};
