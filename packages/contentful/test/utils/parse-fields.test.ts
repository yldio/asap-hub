import { Entry } from 'contentful-management';
import {
  addLocaleToFields,
  createLink,
  getBulkPayload,
  getLinkEntities,
  getLinkEntity,
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

describe('getLinkEntity', () => {
  test('version is false', () => {
    const id = '42';
    expect(getLinkEntity(id)).toEqual({
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id,
      },
    });
  });
  test('version is true', () => {
    const id = '42';
    expect(getLinkEntity(id, true)).toEqual({
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id,
        version: 1,
      },
    });
  });
});

describe('getLinkEntities', () => {
  test('version is false', () => {
    const id = '42';
    expect(getLinkEntities([id])).toEqual([
      {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id,
        },
      },
    ]);
  });
  test('version is true', () => {
    const id = '42';
    expect(getLinkEntities([id], true)).toEqual([
      {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id,
          version: 1,
        },
      },
    ]);
  });
});

describe('getBulkPayload', () => {
  test('version is false', () => {
    const id = '42';
    expect(getBulkPayload([id])).toEqual({
      entities: {
        sys: { type: 'Array' as const },
        items: [
          {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id,
            },
          },
        ],
      },
    });
  });
  test('version is true', () => {
    const id = '42';
    expect(getBulkPayload([id], true)).toEqual({
      entities: {
        sys: { type: 'Array' as const },
        items: [
          {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id,
              version: 1,
            },
          },
        ],
      },
    });
  });
});
