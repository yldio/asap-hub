import { parse } from '../../src/entities/news-and-events';
import { cms } from '../../src/config';

describe('news and events entities', () => {
  test('parse handles thumbnails', async () => {
    const date = new Date().toISOString();
    expect(
      parse({
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
      parse({
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
