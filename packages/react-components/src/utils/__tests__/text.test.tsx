import {
  getUniqueOxfordCommaString,
  getUniqueList,
  appendSuffix,
} from '../index';

describe('appendSuffix', () => {
  it('can add a suffix to each value of the list', () => {
    expect(appendSuffix('one', 'LAB')).toEqual('one LAB');
    expect(appendSuffix('one')).toEqual('one');
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
  describe('getUniqueOxfordCommaString', () => {
    it('add oz', () => {
      expect(
        getUniqueOxfordCommaString(['one', 'two', 'three', 'one']),
      ).toEqual('one, two, and three');
      expect(
        getUniqueOxfordCommaString(['one lab', 'two labs', 'three labs']),
      ).toEqual('one lab, two labs, and three labs');
    });
    it('can add a suffix to each value of the list', () => {
      expect(
        getUniqueOxfordCommaString(['london', 'paris', 'london'], 'Lab'),
      ).toBe('london Lab, and paris Lab');
    });
  });
});
