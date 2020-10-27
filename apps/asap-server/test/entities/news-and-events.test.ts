import {
  parseNewsAndEvents,
  parseGraphQLNewsAndEvents,
} from '../../src/entities';
import { cms } from '../../src/config';

describe('parse news and events entities', () => {
  test('parse handles thumbnails', async () => {
    const date = new Date().toISOString();
    expect(
      parseNewsAndEvents({
        id: 'uuid',
        created: date,
        data: {
          type: {
            iv: 'News',
          },
          title: {
            iv: 'Title',
          },
          shortText: { iv: 'shortText' },
          thumbnail: { iv: ['uuid'] },
          text: {
            iv: 'text',
          },
        },
      }),
    ).toMatchObject({
      id: 'uuid',
      created: date,
      type: 'News',
      title: 'Title',
      shortText: 'shortText',
      text: 'text',
      thumbnail: `${cms.baseUrl}/api/assets/${cms.appName}/uuid`,
    });
  });

  test('parse handles graphQL thumbnails', async () => {
    const date = new Date().toISOString();
    expect(
      parseNewsAndEvents({
        id: 'uuid',
        created: date,
        data: {
          type: {
            iv: 'News',
          },
          title: {
            iv: 'Title',
          },
          shortText: { iv: 'shortText' },
          thumbnail: { iv: [{ id: 'uuid' }] },
          text: {
            iv: 'text',
          },
        },
      }),
    ).toMatchObject({
      id: 'uuid',
      created: date,
      type: 'News',
      title: 'Title',
      shortText: 'shortText',
      text: 'text',
      thumbnail: `${cms.baseUrl}/api/assets/${cms.appName}/uuid`,
    });
  });
});

describe('parse GraphQL news and events entities', () => {
  test('parse handles thumbnails', async () => {
    const date = new Date().toISOString();
    expect(
      parseGraphQLNewsAndEvents({
        id: 'uuid',
        created: date,
        flatData: {
          type: 'News',

          title: 'Title',

          shortText: 'shortText',
          thumbnail: [{ id: 'uuid' }],
          text: 'text',
        },
      }),
    ).toMatchObject({
      id: 'uuid',
      created: date,
      type: 'News',
      title: 'Title',
      shortText: 'shortText',
      text: 'text',
      thumbnail: `${cms.baseUrl}/api/assets/${cms.appName}/uuid`,
    });
  });
});
