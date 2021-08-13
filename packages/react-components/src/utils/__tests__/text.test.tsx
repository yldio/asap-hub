import {
  getUniqueCommaStringWithSuffix,
  getUniqueList,
  appendSuffix,
  getCommaAndString,
} from '../index';

describe('appendSuffix', () => {
  it('can add a suffix to each value of the list', () => {
    expect(appendSuffix('one', 'LAB')).toEqual('one LAB');
  });
});

describe('getUniqueList', () => {
  it('is case sensitive', () => {
    expect(getUniqueList(['one', 'two', 'three', 'one'])).toEqual([
      'one',
      'two',
      'three',
    ]);
    expect(getUniqueList(['ONE', 'two', 'three', 'one'])).toEqual([
      'ONE',
      'two',
      'three',
      'one',
    ]);
  });
  it('returns a string that represents a unique list of the values', () => {
    expect(getUniqueList(['one', 'two', 'three', 'one'])).toEqual([
      'one',
      'two',
      'three',
    ]);
    expect(getUniqueList(['one lab', 'two labs', 'three labs'])).toEqual([
      'one lab',
      'two labs',
      'three labs',
    ]);
  });

  describe('getCommaAndString', () => {
    it('separates items in array with commas (except last)', () => {
      expect(getCommaAndString([])).toEqual('');
      expect(getCommaAndString([''])).toEqual('');
      expect(getCommaAndString(['one'])).toEqual('one');
      expect(getCommaAndString(['one', 'two'])).toEqual('one and two');
      expect(getCommaAndString(['one', 'two', 'three'])).toEqual(
        'one, two and three',
      );
      expect(getCommaAndString([' one ', ' two '])).toEqual('one and two');
      expect(getCommaAndString(['one lab', 'two labs', 'three labs'])).toEqual(
        'one lab, two labs and three labs',
      );
    });
  });

  describe('getUniqueCommaStringWithSuffix', () => {
    it('appends a suffix to each item in the array', () => {
      expect(getUniqueCommaStringWithSuffix([], 'lab')).toEqual('');
      expect(getUniqueCommaStringWithSuffix([''], 'lab')).toEqual('');
      expect(getUniqueCommaStringWithSuffix(['one'], 'lab')).toEqual('one lab');
      expect(getUniqueCommaStringWithSuffix(['one', 'two'], 'lab')).toEqual(
        'one lab and two lab',
      );
      expect(
        getUniqueCommaStringWithSuffix(['one', 'two', 'three'], 'lab'),
      ).toEqual('one lab, two lab and three lab');
      expect(
        getUniqueCommaStringWithSuffix(
          ['BCN one', 'LON two', 'MAD three'],
          'lab',
        ),
      ).toEqual('BCN one lab, LON two lab and MAD three lab');
    });
  });
});
