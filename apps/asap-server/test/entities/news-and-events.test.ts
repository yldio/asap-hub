import { config, GraphqlNewsOrEvent } from '@asap-hub/squidex';
import {
  parseNewsAndEvents,
  parseGraphQLNewsAndEvents,
} from '../../src/entities';

describe('parse news and events entities', () => {
  test('parse handles thumbnails', async () => {
    const date = new Date().toISOString();
    expect(
      parseNewsAndEvents({
        id: 'uuid',
        created: date,
        lastModified: date,
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
      thumbnail: `${config.baseUrl}/api/assets/${config.appName}/uuid`,
    });
  });
});

describe('parse GraphQL news and events entities', () => {
  test('parse handles thumbnails', async () => {
    const date = new Date().toISOString();
    const newsOrEvent: GraphqlNewsOrEvent = {
      id: 'uuid',
      created: date,
      lastModified: date,
      data: null,
      flatData: {
        type: 'News',
        title: 'Title',
        shortText: 'shortText',
        thumbnail: [{ id: 'uuid' }],
        text: 'text',
      },
    };

    expect(parseGraphQLNewsAndEvents(newsOrEvent)).toMatchObject({
      id: 'uuid',
      created: date,
      type: 'News',
      title: 'Title',
      shortText: 'shortText',
      text: 'text',
      thumbnail: `${config.baseUrl}/api/assets/${config.appName}/uuid`,
    });
  });
});
