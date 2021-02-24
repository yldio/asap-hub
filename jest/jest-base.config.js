const { join } = require('path');

const testPathIgnorePatterns = ['\\.browser-test\\.(js|jsx|ts|tsx)$'];

module.exports = {
  testRunner: require.resolve('jest-circus/runner'),
  testEnvironment: 'node',
  setupFilesAfterEnv: [require.resolve('./flags-setup-after-env.js')],

  cacheDirectory: join(__dirname, '..', '.jest-cache'),

  modulePathIgnorePatterns: [
    '<rootDir>/build([^/]*)/',
    '<rootDir>/coverage/',
    '<rootDir>/packages/services-common/src/cms/',
  ],
  testPathIgnorePatterns,

  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: testPathIgnorePatterns,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  watchPlugins: [
    require.resolve('jest-watch-select-projects'),
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),

    require.resolve('jest-watch-suspend'),
    require.resolve('jest-runner-eslint/watch-fix'),
  ],
};
