import { buildEqFilterForWords, makeODataFilter } from '../../src/utils/odata';

describe('makeODataFilter', () => {
  test('converts the object to a format accepted by OData', () => {
    expect(
      makeODataFilter({
        title: 'some title',
        link: 'https://somelink.com',
        documentType: ['a', 'b', 'c'],
      }),
    ).toStrictEqual([
      { 'data/title/iv': 'some title' },
      { 'data/link/iv': 'https://somelink.com' },
      {
        or: [
          { 'data/documentType/iv': 'a' },
          { 'data/documentType/iv': 'b' },
          { 'data/documentType/iv': 'c' },
        ],
      },
    ]);
  });

  describe('when the filter is not defined', () => {
    test('returns null', () => {
      expect(makeODataFilter()).toBeNull();
      expect(makeODataFilter(undefined)).toBeNull();
    });
  });
});

describe('buildEqFilterForWords', () => {
  test('builds the query correctly', () => {
    expect(
      buildEqFilterForWords('some field', ['a', 'b', 'c'], 'subField'),
    ).toStrictEqual({
      or: [
        { 'data/some field/iv/subField': 'a' },
        { 'data/some field/iv/subField': 'b' },
        { 'data/some field/iv/subField': 'c' },
      ],
    });
  });

  describe('when there are no words', () => {
    test('returns empty string', () => {
      expect(buildEqFilterForWords('some field', undefined, 'subField')).toBe(
        '',
      );
      expect(buildEqFilterForWords('some field', [], 'subField')).toBe('');
    });
  });

  describe('when there are no subFields', () => {
    test('builds the query pointing to the field', () => {
      expect(
        buildEqFilterForWords('some field', ['a', 'b', 'c']),
      ).toStrictEqual({
        or: [
          { 'data/some field/iv': 'a' },
          { 'data/some field/iv': 'b' },
          { 'data/some field/iv': 'c' },
        ],
      });
    });
  });
});
