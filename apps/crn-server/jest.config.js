const { ...baseConfig } = require('../../jest/jest-base.config.js');

module.exports = {
  ...baseConfig,

  setupFiles: ['<rootDir>/setup-jest.ts'],
  displayName: 'test-backend',
};
