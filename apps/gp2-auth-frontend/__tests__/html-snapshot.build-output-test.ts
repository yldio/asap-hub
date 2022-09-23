import { readFileSync } from 'fs';
import { resolve } from 'path';
import { JSDOM } from 'jsdom';

describe('the built index.html', () => {
  it('is unchanged', () => {
    const { window } = new JSDOM(
      readFileSync(resolve(__dirname, '../build/index.html')),
    );
    // !!!!! When this snapshot changes the built index.html file
    // must be manually synced to Auth0 according do the docs !!!!!
    expect(window.document.documentElement).toMatchInlineSnapshot(`
      <html
        lang="en"
      >
        <head>
          <meta
            charset="utf-8"
          />
          <meta
            content="width=device-width,initial-scale=1"
            name="viewport"
          />
          <meta
            content="#34A270"
            name="theme-color"
          />
          <meta
            content="Sign in to the Hub application by GP2"
            name="description"
          />
          <link
            href="https://dev.gp2.asap.science/.auth/favicon.png"
            rel="icon"
          />
          <link
            href="https://dev.gp2.asap.science/.auth/logo192.png"
            rel="apple-touch-icon"
          />
          <link
            href="https://fonts.gstatic.com"
            rel="preconnect"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://dev.gp2.asap.science/.auth/manifest.json"
            rel="manifest"
          />
          <title>
            GP2 Hub Signin
          </title>
          <script
            defer="defer"
            src="https://dev.gp2.asap.science/.auth/static/js/main.chunk.js"
          />
        </head>
        <body>
          <noscript>
            You need to enable JavaScript to run this app.
          </noscript>
          <div
            id="root"
          />
        </body>
      </html>
    `);
  });
});
