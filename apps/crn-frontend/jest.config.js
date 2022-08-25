const {
  setupFilesAfterEnv,
  moduleNameMapper,
  ...baseConfig
} = require('../../jest/jest-base.config.js');

module.exports = {
  ...baseConfig,

  rootDir: __dirname,
  testEnvironment: 'jsdom',

  setupFiles: [require.resolve('react-app-polyfill/jsdom')],
  setupFilesAfterEnv: [
    ...(setupFilesAfterEnv || []),
    require.resolve('../../jest/dom-extensions-setup-after-env.js'),
  ],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': require.resolve(
      'react-scripts/config/jest/babelTransform.js',
    ),
    '^.+\\.css$': require.resolve('react-scripts/config/jest/cssTransform.js'),
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': require.resolve(
      './scripts/file-transform.js',
    ),
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    ...moduleNameMapper,
    '^.+\\.module\\.(css|sass|scss)$': require.resolve('identity-obj-proxy'),
  },
  modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],

  displayName: 'test-frontend',
};
