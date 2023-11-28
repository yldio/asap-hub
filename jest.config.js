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
const packagesWithCustomConfig = [];
const packagesWithDefaultConfig = [];
packages.forEach((app) => {
  const appDir = resolve(packagesDir, app);
  if (readdirSync(appDir).includes('jest.config.js')) {
    packagesWithCustomConfig.push(app);
  } else {
    packagesWithDefaultConfig.push(app);
  }
});

const packageTestConfigs = packagesWithDefaultConfig.map((package) =>
  makeDefaultConfig(packagesDir, package),
);
const appTestConfigs = appsWithDefaultConfig.map((app) =>
  makeDefaultConfig(appsDir, app),
);
// For apps with a custom config in their directory, we just have to give Jest the path to them
const appPaths = appsWithCustomConfig.map((app) => resolve(appsDir, app));
const packagePaths = packagesWithCustomConfig.map((package) =>
  resolve(packagesDir, package),
);

module.exports = {
  ...baseConfig,
  projects: [
    ...packageTestConfigs,
    ...appTestConfigs,
    ...appPaths,
    ...packagePaths,
  ],
  testTimeout: 10000,
  testRegex: '^$', // root project does not have tests itself
};
