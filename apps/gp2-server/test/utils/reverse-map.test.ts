import { reverseMap } from '../../src/utils/reverse-map';

describe('Reverse map', () => {
  test('should reverse the mapping', () => {
    const map = { a: 1, b: 2 };
    const reversedMap = reverseMap(map);
    expect(reversedMap).toEqual({ 1: 'a', 2: 'b' });
  });
});
