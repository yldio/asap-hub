import { Entry } from 'contentful-management';
import {
  addLocaleToFields,
  createLink,
  updateEntryFields,
} from '../../src/utils/parse-fields';

describe('addLocaleToFields', () => {
  test('adds locale to fields', () => {
    expect(
      addLocaleToFields({
        title: 'News',
        description: 'Very informative news',
      }),
    ).toEqual({
      description: { 'en-US': 'Very informative news' },
      title: { 'en-US': 'News' },
    });
  });
});

describe('createLink', () => {
  test('returns the right object given id', () => {
    expect(createLink('id')).toEqual({
      sys: { id: 'id', linkType: 'Entry', type: 'Link' },
    });
  });
});

describe('updateEntryFields', () => {
  test('updates entry fields', () => {
    expect(
      updateEntryFields(
        {
          fields: {
            title: {
              'en-US': 'Cells',
            },
          },
        } as unknown as Entry,
        {
          title: 'Tissues',
        },
      ),
    ).toEqual({ fields: { title: { 'en-US': 'Tissues' } } });
  });
});
