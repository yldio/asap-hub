import { cleanArray } from '../../src/utils/clean-array';

describe('cleanArray', () => {
  it('should return an empty array for undefined input', () => {
    expect(cleanArray(undefined)).toEqual([]);
  });

  it('should handle an empty input array', () => {
    expect(cleanArray([])).toEqual([]);
  });

  it('should remove null items from the array', () => {
    expect(cleanArray([1, null, 'hello', null, 42])).toEqual([1, 'hello', 42]);
  });

  it('should preserve the order of non-null items', () => {
    const first = { id: 1 };
    const second = { id: 2 };
    const third = { id: 3 };

    expect(cleanArray([first, null, second, null, third])).toEqual([
      first,
      second,
      third,
    ]);
  });

  it('should preserve falsy values that are not null', () => {
    expect(cleanArray([0, false, '', null, 'value'])).toEqual([
      0,
      false,
      '',
      'value',
    ]);
  });

  it('should remove undefined items when they are present at runtime', () => {
    const items = [1, undefined, 2, null, 3] as unknown as Array<
      number | null | undefined
    >;

    expect(cleanArray(items)).toEqual([1, 2, 3]);
  });
});
