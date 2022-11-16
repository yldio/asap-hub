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
    '^csv-stringify/browser/esm': require.resolve('csv-stringify'),
  },
  displayName: 'test-frontend-utils',
};
