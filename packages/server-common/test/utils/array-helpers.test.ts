import { getFirstValid } from '../../src/utils/array-helpers';

describe('getFirstValid', () => {
  it('returns the first non-null item', () => {
    expect(getFirstValid([null, { id: 'a' }, { id: 'b' }])).toEqual({
      id: 'a',
    });
  });

  it('skips undefined entries', () => {
    expect(getFirstValid([undefined, null, { id: 'a' }])).toEqual({ id: 'a' });
  });

  it('preserves falsy-but-valid values', () => {
    expect(getFirstValid([null, 0, 1])).toBe(0);
    expect(getFirstValid([null, '', 'x'])).toBe('');
    expect(getFirstValid([null, false, true])).toBe(false);
  });

  it('returns null when all items are null/undefined', () => {
    expect(getFirstValid([null, undefined, null])).toBeNull();
  });

  it('returns null for an empty array', () => {
    expect(getFirstValid([])).toBeNull();
  });

  it('returns null when items is undefined', () => {
    expect(getFirstValid(undefined)).toBeNull();
  });

  it('returns null when items is null', () => {
    expect(getFirstValid(null)).toBeNull();
  });
});
