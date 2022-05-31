const { execSync } = require('child_process');
const { copyFileSync, readFileSync, writeFileSync, renameSync } = require('fs');
const { resolve } = require('path');
const { env } = require('process');
const { JSDOM } = require('jsdom');
const del = require('del');

const buildDir = resolve(__dirname, '../build');

function runBuild(APP) {
  // run CRA build script
  try {
    execSync('yarn run react-scripts build', {
      stdio: 'pipe',
      env: {
        ...env,
        PUBLIC_URL:
          env.AUTH_FRONTEND_BASE_URL || 'https://dev.hub.asap.science/.auth/',
        APP,
      },
    });
  } catch (err) {
    throw new Error(
      `react-scripts build failed with status ${err.status}. Output:\n${err.output}`,
    );
  }
}

function replaceHTML() {
  // replace unstable parts of HTML
  const indexHtmlPath = resolve(buildDir, 'index.html');
  const { window } = new JSDOM(readFileSync(indexHtmlPath));
  const { document } = window;
  const scriptReplacements = [
    {
      regex: /static\/js\/main\.[0-9a-f]{8}\.chunk\.js$/,
      replacement: 'static/js/main.chunk.js',
    },
    {
      regex: /static\/js\/2\.[0-9a-f]{8}\.chunk\.js$/,
      replacement: 'static/js/2.chunk.js',
    },
  ];
  scriptReplacements.forEach(({ regex, replacement }) => {
    [...document.querySelectorAll('script[src]')].forEach((script) => {
      script.src = script.src.replace(regex, (match) => {
        copyFileSync(resolve(buildDir, match), resolve(buildDir, replacement));
        return replacement;
      });
    });
  });
  writeFileSync(
    indexHtmlPath,
    '<!doctype html>' + document.documentElement.outerHTML,
  );
}

function renameBuildFolder(APP) {
  const targetDir = resolve(__dirname, `../build-${APP}`);
  try {
    del.sync(targetDir);
    renameSync(buildDir, targetDir);
  } catch (err) {
    throw new Error(err);
  }
}

//Build gp2-app
runBuild('gp2');
replaceHTML();
renameBuildFolder('gp2');
// // //Build crn-app
runBuild('crn');
replaceHTML();
//TODO: remove comment to rename the build folder to crn-build
//renameBuildFolder('crn');
