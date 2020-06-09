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
Object.defineProperty(window, 'crypto', { value: new Crypto() });
