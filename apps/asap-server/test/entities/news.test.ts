import { config } from '@asap-hub/squidex';
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
    const news = {
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
        link: 'http://a.link',
        linkText: 'Link text',
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
  test.each`
    description    | type         | expected
    ${'invalid'}   | ${'invalid'} | ${'News'}
    ${'undefined'} | ${undefined} | ${'News'}
  `('parse handles $description type', async ({ type, expected }) => {
    const date = new Date().toISOString();
    const news = {
      id: 'uuid',
      created: date,
      lastModified: date,
      data: null,
      flatData: {
        type,
        title: 'Title',
        shortText: 'shortText',
        thumbnail: [{ id: 'uuid' }],
        text: 'text',
        link: 'http://a.link',
        linkText: 'Link text',
      },
    };
    expect(parseGraphQLNews(news).type).toEqual(expected);
  });
});
