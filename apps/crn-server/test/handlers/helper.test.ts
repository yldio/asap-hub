import { addTagsFunction } from '../../src/handlers/helper';
import { getEventDataObject } from '../fixtures/events.fixtures';
import { getUserResponse } from '../fixtures/users.fixtures';

describe('addTagsFunction', () => {
  test('add object tags to _tags when this field is present', () => {
    const tags = [
      { id: '1', name: 'Protein' },
      { id: '2', name: 'Blood' },
    ];
    const user = {
      ...getUserResponse(),
      tags: tags,
    };
    expect(addTagsFunction(user)).toEqual({
      ...user,
      _tags: ['Protein', 'Blood'],
    });
  });

  test('add empty _tags when tags field is not present', () => {
    // This should not happen, it was necessary to add
    // so Typescript does not moan about checking if tags
    // exist
    const { tags: __tags, ...event } = getEventDataObject();

    expect(addTagsFunction(event as any)).toEqual({ ...event, _tags: [] });
  });
});
