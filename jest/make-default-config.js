const { existsSync } = require('fs');
const { resolve } = require('path');

const baseConfig = require('./jest-base.config.js');

/**
 * @param {string} parentDir
 * @param {string} packageName
 */
const makeDefaultConfig = (parentDir, packageName) => {
  const rootDir = resolve(parentDir, packageName);
  const displayName = `test-${packageName}`;

  const transform = {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      { configFile: require.resolve('../babel-cjs.config.js') },
    ],
  };

  let testEnvironment = 'node';
  const setupFilesAfterEnv = [...(baseConfig.setupFilesAfterEnv || [])];

  const tsconfigPath = resolve(rootDir, 'tsconfig.json');
  const packageTsLibs = existsSync(tsconfigPath)
    ? require(tsconfigPath).compilerOptions.lib
    : undefined;
  if (
    packageTsLibs &&
    packageTsLibs.some((lib) => lib.toLowerCase() === 'dom')
  ) {
    transform['^.+\\.(gif|jpg|png)$'] = require.resolve(
      './filename-transform.js',
    );
    testEnvironment = 'jsdom';
    setupFilesAfterEnv.push(
      require.resolve('./dom-extensions-setup-after-env.js'),
    );
  }
  return {
    ...baseConfig,

    rootDir,
    displayName,

    transform,

    testEnvironment,
    setupFilesAfterEnv,
  };
};

module.exports = makeDefaultConfig;
