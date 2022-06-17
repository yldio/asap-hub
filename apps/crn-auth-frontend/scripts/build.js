const { execSync } = require('child_process');
const { copyFileSync, readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { env } = require('process');
const { JSDOM } = require('jsdom');

// run CRA build script

try {
  execSync('yarn run react-scripts build', {
    stdio: 'pipe',
    env: {
      ...env,
      PUBLIC_URL:
        env.AUTH_FRONTEND_BASE_URL || 'https://dev.hub.asap.science/.auth/',
    },
  });
} catch (err) {
  throw new Error(
    `react-scripts build failed with status ${err.status}. Output:\n${err.output}`,
  );
}

// replace unstable parts of HTML

const buildDir = resolve(__dirname, '../build');
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
