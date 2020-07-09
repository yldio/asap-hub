module.exports = {
  testRunner: require.resolve('jest-circus/runner'),
  testEnvironment: 'node',

  modulePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/coverage/',
    'packages/services-common/src/cms/*',
  ],

  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 98,
      functions: 99,
      lines: 99,
      statements: 99,
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
