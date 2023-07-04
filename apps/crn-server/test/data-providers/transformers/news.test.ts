import { appName, baseUrl } from '../../../src/config';
import { parseGraphQLNews } from '../../../src/data-providers/transformers';

describe('parse GraphQL news transformers', () => {
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
      title: 'Title',
      shortText: 'shortText',
      text: 'text',
      thumbnail: expected,
    });
  });
});
