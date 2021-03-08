const {
  testPathIgnorePatterns,
  ...base
} = require('./jest/jest-base.config.js');

module.exports = {
  ...base,
  testMatch: ['**/*.build-output-test.{js,jsx,ts,tsx}'],
};
