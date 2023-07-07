import nock from 'nock';
import { RestPage, SquidexRest } from '@asap-hub/squidex';
import { PageSquidexDataProvider } from '../../src/data-providers/page.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';
import { identity } from '../helpers/squidex';

describe('Page data provider', () => {
  const pageRestClient = new SquidexRest<RestPage>(getAuthToken, 'pages', {
    appName,
    baseUrl,
  });
  const pageDataProvider = new PageSquidexDataProvider(pageRestClient);

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('Fetch method', () => {
    test('Should return an empty result when no pages are found', async () => {
      const path = '/not-found';

      nock(baseUrl)
        .get(`/api/content/${appName}/pages`)
        .query({
          q: JSON.stringify({
            take: 8,
            filter: {
              path: 'data.path.iv',
              op: 'eq',
              value: path,
            },
          }),
        })
        .reply(200, {
          total: 0,
          items: [],
        });

      const result = await pageDataProvider.fetch({ filter: { path } });

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return the result when the page exists', async () => {
      nock(baseUrl)
        .get(`/api/content/${appName}/pages`)
        .query({
          q: JSON.stringify({
            take: 8,
          }),
        })
        .reply(200, {
          total: 1,
          items: [
            {
              id: 'some-id',
              data: {
                path: { iv: '/privacy-policy' },
                text: {
                  iv: '<h1>Privacy Policy</h1>',
                },
                shortText: {
                  iv: 'short text',
                },
                title: {
                  iv: 'Privacy Policy',
                },
                link: {
                  iv: 'link',
                },
                linkText: {
                  iv: 'linkText',
                },
              },
            },
          ],
        });

      const result = await pageDataProvider.fetch();

      expect(result).toEqual({
        total: 1,
        items: [
          {
            id: 'some-id',
            path: '/privacy-policy',
            shortText: 'short text',
            text: '<h1>Privacy Policy</h1>',
            title: 'Privacy Policy',
            link: 'link',
            linkText: 'linkText',
          },
        ],
      });
    });

    test('Should query pages by path', async () => {
      const path = '/page';

      nock(baseUrl)
        .get(`/api/content/${appName}/pages`)
        .query({
          q: JSON.stringify({
            take: 8,
            filter: {
              path: 'data.path.iv',
              op: 'eq',
              value: path,
            },
          }),
        })
        .reply(200, {
          total: 1,
          items: [
            {
              id: 'some-id',
              data: {
                path: { iv: '/privacy-policy' },
                text: {
                  iv: '<h1>Privacy Policy</h1>',
                },
                shortText: {
                  iv: 'short text',
                },
                title: {
                  iv: 'Privacy Policy',
                },
                link: {
                  iv: 'link',
                },
                linkText: {
                  iv: 'linkText',
                },
              },
            },
          ],
        });

      const result = await pageDataProvider.fetch({ filter: { path } });

      expect(result).toEqual({
        total: 1,
        items: [
          {
            id: 'some-id',
            path: '/privacy-policy',
            shortText: 'short text',
            text: '<h1>Privacy Policy</h1>',
            title: 'Privacy Policy',
            link: 'link',
            linkText: 'linkText',
          },
        ],
      });
    });
  });

  describe('Fetch-by-id', () => {
    test('should throw an error', async () => {
      await expect(pageDataProvider.fetchById()).rejects.toThrow(
        'Method not implemented.',
      );
    });
  });
});
