const {
  setupFilesAfterEnv,
  ...baseConfig
} = require('../../jest/jest-base.config.js');

module.exports = {
  ...baseConfig,

  rootDir: __dirname,
  testEnvironment: 'jsdom',

  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  setupFilesAfterEnv: [
    ...(setupFilesAfterEnv || []),
    require.resolve('../../jest/dom-extensions-setup-after-env.js'),
  ],
  displayName: 'test-gp2-components',
};
