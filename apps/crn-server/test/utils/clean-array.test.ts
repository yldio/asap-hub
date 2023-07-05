import { cleanArray } from '../../src/utils/clean-array';

describe('CleanArray', () => {
  test('should return empty array if collection is undefined', () => {
    const collection = undefined;
    const result = cleanArray(collection);

    expect(result).toEqual([]);
  });

  test('should remove null values from collection', () => {
    const collection = [null, { id: 1 }, null, { id: 2 }, { id: 3 }];
    const result = cleanArray(collection);

    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
});
