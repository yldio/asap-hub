const { readdirSync } = require('fs');
const { resolve } = require('path');

const baseConfig = require('./jest-base.config.js');

const packagesDir = resolve(__dirname, 'packages');
const appsDir = resolve(__dirname, 'apps');

const packages = readdirSync(packagesDir);
const apps = readdirSync(appsDir);

const packageTestConfigs = packages.map((package) => ({
  ...baseConfig,

  rootDir: resolve(packagesDir, package),

  displayName: `test-${package}`,
}));
// these have their own configs, we just give Jest the path to them.
const appPaths = apps.map((app) => resolve(appsDir, app));

const lintConfigs = [
  ...packages.map((package) => [packagesDir, package]),
  ...apps.map((app) => [appsDir, app]),
].map(([dir, packageOrApp]) => ({
  rootDir: resolve(dir, packageOrApp),
  runner: require.resolve('jest-runner-eslint'),
  testMatch: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}'],

  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/coverage/'],

  displayName: `lint-${packageOrApp}`,
}));

module.exports = {
  ...baseConfig,
  projects: [...lintConfigs, ...packageTestConfigs, ...appPaths],
  testRegex: '^$', // root project does not have tests itself
};
