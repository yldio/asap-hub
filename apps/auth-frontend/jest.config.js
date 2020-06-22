module.exports = {
  ...require('../../jest-base.config.js'),

  rootDir: __dirname,
  testEnvironment: require.resolve('jest-environment-jsdom-sixteen'),

  setupFiles: [require.resolve('react-app-polyfill/jsdom')],
  setupFilesAfterEnv: [
    require.resolve('../../jest/dom-extensions-setup-after-env.js'),
  ],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': require.resolve(
      'react-scripts/config/jest/babelTransform.js',
    ),
    '^.+\\.css$': require.resolve('react-scripts/config/jest/cssTransform.js'),
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': require.resolve(
      'react-scripts/config/jest/fileTransform.js',
    ),
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': require.resolve('identity-obj-proxy'),
  },

  displayName: 'test-auth-frontend',
};
