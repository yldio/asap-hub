const {
  testPathIgnorePatterns,
  ...base
} = require('./jest/jest-base.config.js');

module.exports = {
  ...base,
  testMatch: [
    //'**/reminders.integration-test.{js,jsx,ts,tsx}',
    '**/research-outputs.integration-test.{js,jsx,ts,tsx}',
    '**/teams.integration-test.{js,jsx,ts,tsx}',
    '**/users.integration-test.{js,jsx,ts,tsx}',
  ],
};
