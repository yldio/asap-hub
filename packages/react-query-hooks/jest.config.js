const {
  setupFilesAfterEnv,
  moduleNameMapper,
  ...baseConfig
} = require('../../jest/jest-base.config.js');

module.exports = {
  ...baseConfig,
  rootDir: __dirname,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    ...(setupFilesAfterEnv || []),
    require.resolve('../../jest/dom-extensions-setup-after-env.js'),
  ],
  moduleNameMapper: {
    ...moduleNameMapper,
  },
  displayName: 'test-react-query-hooks',
};
