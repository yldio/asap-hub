const { readdirSync } = require('fs');
const { resolve } = require('path');

const packagesDir = resolve(__dirname, '../packages');
const appsDir = resolve(__dirname, '../apps');

const packages = readdirSync(packagesDir);
const apps = readdirSync(appsDir);
module.exports = [
  ...packages.map((package) => [packagesDir, package]),
  ...apps.map((app) => [appsDir, app]),
].map(([dir, packageOrApp]) => ({
  rootDir: resolve(dir, packageOrApp),
  runner: require.resolve('jest-runner-eslint'),
  testMatch: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}'],
  modulePathIgnorePatterns: ['<rootDir>/build(-cjs)?/'],

  displayName: `lint-${packageOrApp}`,
}));
