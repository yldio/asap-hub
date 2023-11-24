const baseConfig = require('./jest/jest-base.config.js');

const lintConfigs = require('./jest/jest-lint.config');

module.exports = {
  projects: [...lintConfigs],
  testTimeout: 10000,
  testRegex: '^$', // root project does not have tests itself
  maxWorkers: 1,
  // workerIdleMemoryLimit: '1024MB'
};
