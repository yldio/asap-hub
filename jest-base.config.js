module.exports = {
  testRunner: require.resolve('jest-circus/runner'),
  testEnvironment: 'node',

  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/coverage/'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}'],

  watchPlugins: [
    require.resolve('jest-watch-select-projects'),
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
    require.resolve('jest-runner-eslint/watch-fix'),
  ],
};
