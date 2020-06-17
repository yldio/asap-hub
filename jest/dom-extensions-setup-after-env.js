// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// emotion CSS matchers
import { matchers } from 'jest-emotion';
expect.extend(matchers);

// fetch polyfill
import fetch from 'node-fetch';
window.fetch = fetch;

// form validation polyfill
import hyperform from 'hyperform';
hyperform(window);

// The Auth0 library needs the WebCrypto API
import { Crypto } from '@peculiar/webcrypto';
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
