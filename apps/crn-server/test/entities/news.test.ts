import { appName, baseUrl } from '../../src/config';
import { parseGraphQLNews } from '../../src/entities';

describe('parse GraphQL news entities', () => {
  test.each`
    description       | thumbnail           | expected
    ${'no thumbnail'} | ${undefined}        | ${undefined}
    ${'thumbnail'}    | ${[{ id: 'uuid' }]} | ${`${baseUrl}/api/assets/${appName}/uuid`}
  `('parse handles $description', async ({ thumbnail, expected }) => {
    const date = new Date().toISOString();
    const news = {
      id: 'uuid',
      created: date,
      lastModified: date,
      version: 42,
      data: null,
      flatData: {
        type: 'News',
        title: 'Title',
        shortText: 'shortText',
        thumbnail,
        text: 'text',
        link: 'http://a.link',
        linkText: 'Link text',
        frequency: 'Biweekly Newsletter',
      },
    };

    expect(parseGraphQLNews(news)).toMatchObject({
      id: 'uuid',
      created: date,
      type: 'News',
      title: 'Title',
      shortText: 'shortText',
      text: 'text',
      thumbnail: expected,
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
      version: 42,
      data: null,
      flatData: {
        type,
        title: 'Title',
        shortText: 'shortText',
        thumbnail: [{ id: 'uuid' }],
        text: 'text',
        link: 'http://a.link',
        linkText: 'Link text',
        frequency: 'Biweekly Newsletter',
      },
    };
    expect(parseGraphQLNews(news).type).toEqual(expected);
  });
});
