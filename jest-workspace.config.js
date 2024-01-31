const { resolve } = require('path');

const baseConfig = require('./jest/jest-base.config.js');
const makeDefaultConfig = require('./jest/make-default-config');
const workspacePath = process.env.WORKSPACE_PATH;

if (!workspacePath) {
  throw new Error('Directory variable not set');
}
const workspaceDir = resolve(__dirname, workspacePath);
const workspaceParentDir = workspaceDir.split('/').slice(0, -1).join('/');
const workspaceName = workspaceDir.split('/').slice(-1)[0];

const config = makeDefaultConfig(workspaceParentDir, workspaceName);

module.exports = {
  ...baseConfig,
  projects: [config],
  testTimeout: 10000,
  testRegex: '^$', // root project does not have tests itself
};
