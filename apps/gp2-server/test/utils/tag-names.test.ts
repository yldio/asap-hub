import { TagDataObject } from '@asap-hub/model/src/gp2';
import { getTagsNames } from '../../src/utils/tag-names';

describe('getTagsNames', () => {
  test('it should return an array of names', () => {
    const tags: TagDataObject[] = [
      { id: '1', name: 'one' },
      { id: '2', name: 'two' },
    ];
    expect(getTagsNames(tags)).toEqual(['one', 'two']);
  });
});
