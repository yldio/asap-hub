// https://github.com/serverless/serverless/issues/5634

import { mkdirSync, unlinkSync, symlinkSync } from 'fs';
import { join, dirname, relative } from 'path';
import { plugins } from '../serverless';

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
