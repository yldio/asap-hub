#!/usr/bin/env -S yarn node

const { readFileSync, writeFileSync } = require('fs');
const { join, resolve, extname } = require('path');
const { addHook } = require('pirates');
const { getUserAgentRegExp } = require('browserslist-useragent-regexp');

console.group('Running build-unsupported-browser-page script');

console.log('Building unsupported browser page');

const mimeTypes = {
  '.gif': 'image/gif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};
const revert = addHook(
  (_code, filename) => {
    const extension = extname(filename);
    const mimeType = mimeTypes[extension];
    return `module.exports='data:${mimeType};base64,${readFileSync(
      filename,
    ).toString('base64')}'`;
  },
  { exts: Object.keys(mimeTypes) },
);
const unsupportedBrowserPageFilename = 'unsupported-browser.html';
const unsupportedBrowserPage =
  require('@asap-hub/unsupported-browser-page').default;
revert();

console.log('Building unsupported browser detection script');

const userAgentRegex = getUserAgentRegExp({
  ignoreMinor: true,
  ignorePatch: true,
  allowHigherVersions: true,
});
const detectScriptFilename = 'detect-unsupported-browser.js';
const detectScript = `
  if (!${userAgentRegex.toString()}.test(navigator.userAgent)) {
    var messageAlreadyShownKey = 'unsupported-browser-page-shown';
    if (!window.sessionStorage || window.sessionStorage.getItem(messageAlreadyShownKey)) {
      window.open('/${unsupportedBrowserPageFilename}', 'Unsupported Browser');
    } else {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(messageAlreadyShownKey, true);
      }
      window.location.assign('/${unsupportedBrowserPageFilename}');
    }
  }
`;

console.log('Writing unsupported browser files');

const publicDir = resolve(
  require.resolve('@asap-hub/crn-frontend/package.json'),
  '../public',
);
writeFileSync(
  join(publicDir, unsupportedBrowserPageFilename),
  unsupportedBrowserPage,
);
writeFileSync(join(publicDir, detectScriptFilename), detectScript);

console.groupEnd();
