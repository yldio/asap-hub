const {
  setupFilesAfterEnv,
  moduleNameMapper,
  transform,
  ...baseConfig
} = require('../../jest/jest-base.config.js');

// Use 75% of available CPU cores for tests, leaving some for other processes
// Defaults to 4 if CPU count cannot be determined
const getMaxWorkers = () => {
  try {
    const os = require('os');
    const cpuCount = os.cpus().length;
    return Math.max(1, Math.floor(cpuCount * 0.75));
  } catch {
    return 4;
  }
};

module.exports = {
  ...baseConfig,

  rootDir: __dirname,
  testEnvironment: 'jsdom',

  // Performance optimizations
  maxWorkers: process.env.CI ? '100%' : getMaxWorkers(),
  // Run tests in parallel (default, but explicit for clarity)
  runInBand: false,
  // Increase default timeout slightly for complex React tests
  testTimeout: 15000,

  setupFiles: [require.resolve('react-app-polyfill/jsdom')],
  setupFilesAfterEnv: [
    ...(setupFilesAfterEnv || []),
    require.resolve('../../jest/dom-extensions-setup-after-env.js'),
    require.resolve('./reset-recoil.js'),
    require.resolve('./extend-timeouts.js'),
  ],

  transform: {
    '^.+\\.css$': [require.resolve('jest-transform-css'), { modules: true }],
    ...transform,
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    ...moduleNameMapper,
    '^@asap-hub/react-components/manuscript-form$':
      '@asap-hub/react-components/src/manuscript-form',
    '^.+\\.module\\.(css|sass|scss)$': require.resolve('identity-obj-proxy'),
    '^csv-stringify/browser/esm': require.resolve('csv-stringify'),
  },
  modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],

  displayName: 'test-frontend',
};
