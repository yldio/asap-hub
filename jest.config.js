const { readdirSync } = require('fs');
const { resolve } = require('path');

const baseConfig = require('./jest/jest-base.config.js');
const makeDefaultConfig = require('./jest/make-default-config');

const packagesDir = resolve(__dirname, 'packages');
const appsDir = resolve(__dirname, 'apps');

const packages = readdirSync(packagesDir);
const apps = readdirSync(appsDir);

const appsWithCustomConfig = [];
const appsWithDefaultConfig = [];
apps.forEach((app) => {
  const appDir = resolve(appsDir, app);
  if (readdirSync(appDir).includes('jest.config.js')) {
    appsWithCustomConfig.push(app);
  } else {
    appsWithDefaultConfig.push(app);
  }
});

const packageTestConfigs = packages.map((package) =>
  makeDefaultConfig(packagesDir, package),
);
const appTestConfigs = appsWithDefaultConfig.map((app) =>
  makeDefaultConfig(appsDir, app),
);
// For apps with a custom config in their directory, we just have to give Jest the path to them
const appPaths = appsWithCustomConfig.map((app) => resolve(appsDir, app));

const lintConfigs = [
  ...packages.map((package) => [packagesDir, package]),
  ...apps.map((app) => [appsDir, app]),
].map(([dir, packageOrApp]) => ({
  rootDir: resolve(dir, packageOrApp),
  runner: require.resolve('jest-runner-eslint'),
  testMatch: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.browser-test.{js,jsx,ts,tsx}',
  ],

  modulePathIgnorePatterns: ['<rootDir>/build(-cjs)?/'],

  displayName: `lint-${packageOrApp}`,
}));

module.exports = {
  ...baseConfig,
  projects: [
    ...packageTestConfigs,
    ...appTestConfigs,
    ...appPaths,
    ...lintConfigs,
  ],
  testRegex: '^$', // root project does not have tests itself
};
