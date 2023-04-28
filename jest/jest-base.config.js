const { join, dirname } = require('path');

const root = dirname(require.resolve('asap-hub/package.json'), '..');

const testPathIgnorePatterns = [
  '\\.build-output-test\\.(js|jsx|ts|tsx)$',
  '\\.browser-test\\.(js|jsx|ts|tsx)$',
  '\\.e2e-test\\.(js|jsx|ts|tsx)$',
  '\\.integration-test\\.(js|jsx|ts|tsx)$',
  'gql/',
  '\\.contentful-app-extensions\\.',
];

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [require.resolve('./flags-setup-after-env.js')],
  testTimeout: 10000,

  cacheDirectory: join(root, '.jest-cache'),

  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      { configFile: require.resolve('../babel-cjs.config.js') },
    ],
  },

  moduleNameMapper: {
    '^@asap-hub/([^/]+)$': '@asap-hub/$1/src',
    '\\.(png|jpg|ico|jpeg|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      require.resolve('./imageMock.js'),
    uuid: require.resolve('uuid'),
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build(-cjs)?',
    '<rootDir>/coverage',
    `<rootDir>/packages/services-common/src/cms/`,
    `/contentful-app-extensions/`,
  ],
  testPathIgnorePatterns,

  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: testPathIgnorePatterns,

  watchPlugins: [
    require.resolve('jest-watch-select-projects'),
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),

    require.resolve('jest-watch-suspend'),
    require.resolve('jest-runner-eslint/watch-fix'),
  ],
};
