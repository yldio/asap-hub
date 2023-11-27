const baseConfig = require('./jest/jest-base.config.js');

const lintConfigs = require('./jest/jest-lint.config');

module.exports = {
  ...baseConfig,
  projects: [...lintConfigs],
  testTimeout: 10000,
  testRegex: '^$',
  maxWorkers: 2,
};
