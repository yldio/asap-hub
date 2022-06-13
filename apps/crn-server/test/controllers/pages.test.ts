import nock from 'nock';
import { NotFoundError } from '@asap-hub/errors';
import { RestPage, SquidexRest } from '@asap-hub/squidex';
import Pages from '../../src/controllers/pages';
import { identity } from '../helpers/squidex';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';

describe('Page controller', () => {
  const pageRestClient = new SquidexRest<RestPage>(getAuthToken, 'pages', {
    appName,
    baseUrl,
  });
  const pages = new Pages(pageRestClient);

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  describe('FetchByPath method', () => {
    test('Should throw a Not Found error when the page is not found', async () => {
      const path = '/not-found';

      nock(baseUrl)
        .get(`/api/content/${appName}/pages`)
        .query({
          q: JSON.stringify({
            take: 1,
            filter: {
              path: 'data.path.iv',
              op: 'eq',
              value: path,
            },
          }),
        })
        .reply(404);

      await expect(pages.fetchByPath(path)).rejects.toThrow(NotFoundError);
    });

    test('Should return the result when the page exists', async () => {
      const path = '/page';

      nock(baseUrl)
        .get(`/api/content/${appName}/pages`)
        .query({
          q: JSON.stringify({
            take: 1,
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

      const result = await pages.fetchByPath(path);

      expect(result).toEqual({
        id: 'some-id',
        path: '/privacy-policy',
        shortText: 'short text',
        text: '<h1>Privacy Policy</h1>',
        title: 'Privacy Policy',
        link: 'link',
        linkText: 'linkText',
      });
    });
  });
});
