import { addTagsToEvents } from '../../../src/handlers/event/helper';
import { getEventDataObject } from '../../fixtures/events.fixtures';

describe('addTagsToEvents', () => {
  test('add event tags to _tags when this field is available', () => {
    const tags = ['Protein', 'Blood'];
    const event = {
      ...getEventDataObject(),
      tags,
    };
    expect(addTagsToEvents(event)).toEqual({ ...event, _tags: tags });
  });

  test('add empty _tags when tag field is not present', () => {
    // This should not happen, it was necessary to add
    // so Typescript does not moan about checking if tags
    // exist
    const { tags: __tags, ...event } = getEventDataObject();

    expect(addTagsToEvents(event as any)).toEqual({ ...event, _tags: [] });
  });
});
