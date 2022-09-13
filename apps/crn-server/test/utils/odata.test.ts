import { buildEqFilterForWords } from '../../src/utils/odata';

describe('buildEqFilterForWords', () => {
  test('builds the query correctly', () => {
    expect(
      buildEqFilterForWords('field', ['a', 'b', 'c'], 'subField'),
    ).toStrictEqual({
      or: [
        { 'data/field/iv/subField': 'a' },
        { 'data/field/iv/subField': 'b' },
        { 'data/field/iv/subField': 'c' },
      ],
    });
  });

  describe('when there are no words', () => {
    test('returns empty string', () => {
      expect(buildEqFilterForWords('field', undefined, 'subField')).toBe('');
      expect(buildEqFilterForWords('field', [], 'subField')).toBe('');
    });
  });

  describe('when there are no subFields', () => {
    test('builds the query pointing to the field', () => {
      expect(buildEqFilterForWords('field', ['a', 'b', 'c'])).toStrictEqual({
        or: [
          { 'data/field/iv': 'a' },
          { 'data/field/iv': 'b' },
          { 'data/field/iv': 'c' },
        ],
      });
    });
  });
});
