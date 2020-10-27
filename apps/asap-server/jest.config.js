const { dirname, basename } = require('path');

const makeDefaultConfig = require('../../jest/make-default-config');

const { testPathIgnorePatterns, ...base } = makeDefaultConfig(
  dirname(__dirname),
  basename(__dirname),
);

module.exports = {
  ...base,
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
