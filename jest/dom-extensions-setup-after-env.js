import failOnConsole from 'jest-fail-on-console';
failOnConsole({
  silenceMessage: (msg) =>
    /Recoil: Spent 1[0-9]{1}\.[0-9]+ms computing a cache key/.test(msg),
});

if (typeof document === 'object') {
  // jest-dom adds custom jest matchers for asserting on DOM nodes.
  // allows you to do things like:
  // expect(element).toHaveTextContent(/react/i)
  // learn more: https://github.com/testing-library/jest-dom
  require('@testing-library/jest-dom/extend-expect');

  // emotion CSS matchers
  const { matchers } = require('@emotion/jest');
  expect.extend(matchers);

  // fetch polyfill
  window.fetch = require('node-fetch');

  // form validation polyfill
  const hyperform = require('hyperform');
  hyperform(window);

  // The Auth0 library needs the WebCrypto API
  const { Crypto } = require('@peculiar/webcrypto');
  Object.defineProperty(window, 'crypto', {
    configurable: true,
    enumerable: true,
    value: new Crypto(),
  });

  // very basic viewBox polyfill
  class SVGRect {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  }
  Object.defineProperty(SVGSVGElement.prototype, 'viewBox', {
    configurable: true,
    enumerable: true,
    get: function () {
      const rect = new SVGRect(...this.getAttribute('viewBox').split(' '));
      return { baseVal: rect, animVal: rect };
    },
  });

  // scrollIntoView polyfill
  Element.prototype.scrollIntoView = jest.fn();
  Element.prototype.scrollTo = jest.fn();
}
