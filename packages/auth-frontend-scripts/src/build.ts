import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { JSDOM } from 'jsdom';
import { env } from 'process';
import { execSync } from 'child_process';

// run CRA build script
export const buildScript = (envVars: typeof env): void => {
  try {
    execSync('yarn run react-scripts build', {
      stdio: 'pipe',
      env: envVars,
    });
  } catch (err: ReturnType<Error>) {
    throw new Error(
      `react-scripts build failed with status ${err.status}. Output:\n${err.output}`,
    );
  }
};

export const scriptReplacements = [
  {
    regex: /static\/js\/main\.[0-9a-f]{8}\.chunk\.js$/,
    replacement: 'static/js/main.chunk.js',
  },
  {
    regex: /static\/js\/2\.[0-9a-f]{8}\.chunk\.js$/,
    replacement: 'static/js/2.chunk.js',
  },
];

// This allow us to bypass the issue of not having the HTMLScriptElement class on a node enviroment without having to actually import a polyfill for it
type ScriptElement = Element & {
  src: string;
};
const isScriptElement = (tag: Element | ScriptElement): tag is ScriptElement =>
  (tag as ScriptElement).src !== undefined;

export const replaceScripts = (buildDir: string): void => {
  // replace unstable parts of HTML
  const indexHtmlPath = resolve(buildDir, 'index.html');
  const { window } = new JSDOM(readFileSync(indexHtmlPath));
  const { document } = window;
  scriptReplacements.forEach(({ regex, replacement }) => {
    [...document.querySelectorAll('script[src]')].forEach((script: Element) => {
      if (isScriptElement(script)) {
        // eslint-disable-next-line no-param-reassign
        script.src = script.src.replace(regex, (match: string) => {
          copyFileSync(
            resolve(buildDir, match),
            resolve(buildDir, replacement),
          );
          return replacement;
        });
      }
    });
  });
  writeFileSync(
    indexHtmlPath,
    `<!doctype html>${document.documentElement.outerHTML}`,
  );
};

export const build = (buildDir: string, envVars: typeof env = env): void => {
  buildScript(envVars);
  replaceScripts(buildDir);
};
