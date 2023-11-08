import { addTagsFunction } from '../../../src/handlers/helper';
import { getEventDataObject } from '../../fixtures/events.fixtures';
import { getUserResponse } from '../../fixtures/users.fixtures';

describe('addTagsFunction', () => {
  test('add tags to _tags when this field is present', () => {
    const tags = ['Protein', 'Blood'];
    const event = {
      ...getEventDataObject(),
      tags,
    };
    expect(addTagsFunction(event)).toEqual({ ...event, _tags: tags });
  });

  test('add expertiseAndResourceTags to _tags when this field is present', () => {
    const tags = ['Protein', 'Blood'];
    const user = {
      ...getUserResponse(),
      expertiseAndResourceTags: tags,
    };
    expect(addTagsFunction(user)).toEqual({ ...user, _tags: tags });
  });

  test('add empty _tags when tags and expertiseAndResourceTags fields are not present', () => {
    // This should not happen, it was necessary to add
    // so Typescript does not moan about checking if tags
    // exist
    const { tags: __tags, ...event } = getEventDataObject();

    expect(addTagsFunction(event as any)).toEqual({ ...event, _tags: [] });
  });
});
