import React, { createElement } from 'react';

import { isTextChildren, assertIsTextChildren } from '../text';

/* false positive */
/* eslint-disable jest/no-identical-title */

describe.each([
  [undefined],
  [null],
  [false],
  [true],
  [''],
  ['text'],
  [42],
  [[]],
  [['text']],
  [[[false, 42], 'text']],
])('for the text children %p', (children) => {
  describe('isTextChildren', () => {
    it('returns true', () => {
      expect(isTextChildren(children)).toBe(true);
    });
  });
  describe('assertIsTextChildren', () => {
    it('passes', () => {
      expect(() => assertIsTextChildren(children)).not.toThrow();
    });
  });
});

describe.each([
  [{}],
  [Symbol('Forbidden primitive type')],
  [createElement('div')],
  [createElement(React.Fragment, { children: {} })],
])('for the children %p', (children) => {
  describe('isTextChildren', () => {
    it('returns false', () => {
      expect(isTextChildren(children)).toBe(false);
    });
  });
  describe('assertIsTextChildren', () => {
    it('throws', () => {
      expect(() => assertIsTextChildren(children)).toThrow(/expected.+text/i);
    });
  });
});
