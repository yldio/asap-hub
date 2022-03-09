const { join, dirname } = require('path');

const root = dirname(require.resolve('asap-hub/package.json'), '..');

const testPathIgnorePatterns = [
  '\\.build-output-test\\.(js|jsx|ts|tsx)$',
  '\\.browser-test\\.(js|jsx|ts|tsx)$',
  '\\.e2e-test\\.(js|jsx|ts|tsx)$',
  '\\.integration-test\\.(js|jsx|ts|tsx)$',
  'gql/',
];

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [require.resolve('./flags-setup-after-env.js')],

  cacheDirectory: join(root, '.jest-cache'),

  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      { configFile: require.resolve('../babel-cjs.config.js') },
    ],
  },

  moduleNameMapper: {
    '^@asap-hub/([^/]+)$': '@asap-hub/$1/src',
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build(-cjs)?',
    '<rootDir>/coverage',
    `<rootDir>/packages/services-common/src/cms/`,
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
