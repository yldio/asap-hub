/*
Collect all composite TypeScript projects and print them space-separated so that
they can be passed to TSC via a `tsc -b` command line.
Non-composite projects cannot be built using `tsc -b`; they must be built in separately later.
We do not use any other filtering -
even if a package in the repo is not used by any of our apps (dead code),
we still want to typecheck everything that's in the repo.
*/

const { readdirSync } = require('fs');
const { resolve } = require('path');
const { stdout } = require('process');
const {
  findConfigFile,
  readConfigFile,
  parseJsonConfigFileContent,
  sys: tsSys,
} = require('typescript');

const rootDir = resolve(__dirname, '..');
const packagesDir = resolve(rootDir, 'packages');
const appsDir = resolve(rootDir, 'apps');

const compositeProjectPaths = [];

[packagesDir, appsDir].forEach((parentDir) => {
  const projects = readdirSync(parentDir);
  projects.forEach((projectDir) => {
    const dir = resolve(parentDir, projectDir);
    const { error, config } = readConfigFile(
      findConfigFile(dir, tsSys.fileExists),
      tsSys.readFile,
    );
    if (error) {
      throw new Error(error.messageText);
    }
    const { errors, options } = parseJsonConfigFileContent(config, tsSys, dir);
    if (errors.length) {
      throw new Error(errors.map((error) => error.messageText).join('\n'));
    }
    if (options.composite) {
      compositeProjectPaths.push(dir);
    }
  });
});

stdout.write(compositeProjectPaths.join(' '));
