import { config, GraphqlNews } from '@asap-hub/squidex';
import { parseNews, parseGraphQLNews } from '../../src/entities';

describe('parse news entities', () => {
  test('parse handles thumbnails', async () => {
    const date = new Date().toISOString();
    expect(
      parseNews({
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

describe('parse GraphQL news entities', () => {
  test('parse handles thumbnails', async () => {
    const date = new Date().toISOString();
    const news: GraphqlNews = {
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

    expect(parseGraphQLNews(news)).toMatchObject({
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
