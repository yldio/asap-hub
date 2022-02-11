#!/usr/bin/env node
/*
Collect all composite TypeScript projects and print them space-separated so that
they can be passed to TSC via a `tsc -b` command line.
Non-composite projects cannot be built using `tsc -b`; they must be built in separately later.
We do not use any other filtering -
even if a package in the repo is not used by any of our apps (dead code),
we still want to typecheck everything that's in the repo.
*/

const { existsSync, readdirSync } = require('fs');
const { resolve } = require('path');
const { stdout, exit } = require('process');
const {
  readConfigFile,
  parseJsonConfigFileContent,
  sys: tsSys,
} = require('typescript');

const rootDir = resolve(__dirname, '..');
const packagesDir = resolve(rootDir, 'packages');
const appsDir = resolve(rootDir, 'apps');

const compositeProjectPaths = [];
const configErrors = [];

[packagesDir, appsDir].forEach((parentDir) => {
  const projects = readdirSync(parentDir);
  projects.forEach((projectDir) => {
    const dir = resolve(parentDir, projectDir);

    let dependencies;
    let devDependencies;
    // read package.json
    try {
      ({ dependencies = {}, devDependencies = {} } = require(resolve(
        dir,
        'package.json',
      )));
    } catch {
      // obsolete project dir without a package.json, pretend it doesn't exist
      return;
    }
    const tsconfigPath = resolve(dir, 'tsconfig.json');
    if (!existsSync(tsconfigPath)) {
      // non-TypeScript project, pretend it doesn't exist
      return;
    }

    // read tsconfig.json
    const { error, config } = readConfigFile(tsconfigPath, tsSys.readFile);
    if (error) {
      throw new Error(error.messageText);
    }
    const {
      errors,
      options,
      projectReferences = [],
    } = parseJsonConfigFileContent(config, tsSys, dir);
    if (errors.length) {
      throw new Error(errors.map((error) => error.messageText).join('\n'));
    }
    // Non-composite projects cannot be built using `tsc -b`
    if (!options.composite) {
      return;
    }
    // add to TS projects to compile
    compositeProjectPaths.push(dir);

    // make sure the TS project is not missing any project references
    const dependencyWorkspacePaths = Object.entries({
      ...dependencies,
      ...devDependencies,
    })
      .filter(([, version]) => /workspace:.+/.test(version))
      .flatMap(
        ([package]) =>
          `packages/${(/@asap-hub\/(.+)/.exec(package) || []).slice(1)}`,
      );
    const projectReferencePaths = projectReferences.map(({ path }) => path);
    dependencyWorkspacePaths.forEach((dependencyWorkspacePath) => {
      const dependencyDirUnnormalized = resolve(
        rootDir,
        dependencyWorkspacePath,
      );
      const dependencyDir = dependencyDirUnnormalized.replace(/\\/g, '/');
      if (
        !projectReferencePaths.includes(dependencyDir) &&
        existsSync(resolve(dependencyDir, 'tsconfig.json'))
      ) {
        configErrors.push(
          `Error: tsconfig.json of project ${projectDir} is missing a project reference ` +
            `to its workspace dependency ${dependencyWorkspacePath}.`,
        );
      }
    });
  });
});

if (configErrors.length) {
  configErrors.forEach((error) => console.error(error));
  exit(1);
}

stdout.write(compositeProjectPaths.join(' '));
