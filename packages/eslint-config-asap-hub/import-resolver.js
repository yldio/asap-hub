const assert = require('assert').strict;
const importResolverTypescript = require('eslint-import-resolver-typescript');

module.exports.interfaceVersion = 2;
assert.equal(importResolverTypescript.interfaceVersion, 2);

module.exports.resolve = (source, file) => {
  source = source.replace(/^@asap-hub\/([^/]+)$/, '@asap-hub/$1/src');
  return importResolverTypescript.resolve(source, file, {
    alwaysTryTypes: true,
    project: ['packages/*/tsconfig.json', 'apps/*/tsconfig.json'],
  });
};
