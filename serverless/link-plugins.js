// https://github.com/serverless/serverless/issues/5634

const { mkdirSync, unlinkSync, symlinkSync } = require('fs');
const { join, dirname, relative } = require('path');

const { plugins } = require('../serverless.js');

const pluginsDir = join(__dirname, '../.serverless_plugins');
mkdirSync(pluginsDir, { recursive: true });
plugins.forEach((plugin) => {
  const symlinkPath = join(pluginsDir, plugin);
  const pluginDirectory = dirname(require.resolve(`${plugin}/package.json`));
  try {
    unlinkSync(symlinkPath);
  } catch {}

  symlinkSync(relative(pluginsDir, pluginDirectory), symlinkPath);
});
