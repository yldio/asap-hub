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
            content="Sign in to the Hub application by ASAP: Aligning Science Across Parkinson's"
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
            ASAP Hub Signin
          </title>
        </head>
        <body>
          <noscript>
            You need to enable JavaScript to run this app.
          </noscript>
          <div
            id="root"
          />
          <script>
            !function(e){function t(t){for(var n,a,p=t[0],f=t[1],l=t[2],i=0,s=[];i&lt;p.length;i++)a=p[i],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&s.push(o[a][0]),o[a]=0;for(n in f)Object.prototype.hasOwnProperty.call(f,n)&&(e[n]=f[n]);for(c&&c(t);s.length;)s.shift()();return u.push.apply(u,l||[]),r()}function r(){for(var e,t=0;t&lt;u.length;t++){for(var r=u[t],n=!0,p=1;p&lt;r.length;p++){var f=r[p];0!==o[f]&&(n=!1)}n&&(u.splice(t--,1),e=a(a.s=r[0]))}return e}var n={},o={1:0},u=[];function a(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=n,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(r,n,function(t){return e[t]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="https://dev.gp2.asap.science/.auth/";var p=this["webpackJsonp@asap-hub/crn-auth-frontend"]=this["webpackJsonp@asap-hub/crn-auth-frontend"]||[],f=p.push.bind(p);p.push=t,p=p.slice();for(var l=0;l&lt;p.length;l++)t(p[l]);var c=f;r()}([])
          </script>
          <script
            src="https://dev.gp2.asap.science/.auth/static/js/2.chunk.js"
          />
          <script
            src="https://dev.gp2.asap.science/.auth/static/js/main.chunk.js"
          />
        </body>
      </html>
    `);
  });
});
