import { createElement, Fragment } from 'react';

import {
  isTextChildren,
  assertIsTextChildren,
  isAllowedChildren,
  getHTMLElements,
} from '../text';

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
  [createElement(Fragment, { children: {} })],
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
  [createElement('i')],
  [createElement('em')],
  [createElement('i', { children: ['Italic Text'] })],
])('for the allowed children %p', (children) => {
  describe('isAllowedChildren', () => {
    it('returns true', () => {
      expect(isAllowedChildren(children)).toBe(true);
    });
  });
});

describe.each([
  [{}],
  [Symbol('Forbidden primitive type')],
  [createElement('div')],
  [createElement('b')],
  [createElement('i', { children: [createElement('div')] })],
  [createElement(Fragment, { children: {} })],
])('for the children %p', (children) => {
  describe('isAllowedChildren', () => {
    it('returns false', () => {
      expect(isAllowedChildren(children)).toBe(false);
    });
  });
});

describe('getHTMLElements', () => {
  test.each(['i', 'b'])(
    'returns html with style given node with %s tag',
    (tag) => {
      expect(
        getHTMLElements([
          {
            props: { children: ['bold text'] },
            type: tag,
          },
        ]),
      ).toEqual([`<${tag} style=color:inherit>bold text</${tag}>`]);
    },
  );

  test('returns html with style given node with b and i tags', () => {
    expect(
      getHTMLElements([
        {
          props: {
            children: [
              {
                props: { children: ['bold-italic'] },
                type: 'i',
              },
            ],
          },
          type: 'b',
        },
      ]),
    ).toEqual([
      '<i style=color:inherit><b style=color:inherit>bold-italic</b></i>',
    ]);
  });
});
