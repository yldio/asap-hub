import nock from 'nock';
import { getClient } from '@asap-hub/contentful';
import {
  contentfulSpaceId,
  contentfulAccessToken,
  contentfulEnvId,
  contentfulHost,
} from '../../../src/config';
import {
  getListNewsDataObject,
  newsContentfulApiResponse,
} from '../../fixtures/news.fixtures';
import { NewsContentfulDataProvider } from '../../../src/data-providers/contentful/news.data-provider';

describe('News data provider', () => {
  const newsRestClient = getClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken,
    environment: contentfulEnvId,
  });
  const newsDataProvider = new NewsContentfulDataProvider(newsRestClient);

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
  });

  describe('Fetch method', () => {
    test('Should return an empty result when no news exist', async () => {
      nock(contentfulHost)
        .get(
          `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
        )
        .query({
          content_type: 'news',
          limit: 8,
          skip: 5,
          order: '-sys.createdAt',
        })
        .reply(200, { total: 0, items: [] });

      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test.skip('Should return an empty result when resource does not exist', async () => {
      const query = 'content_type=news&limit=8&skip=5&order=-sys.createdAt';

      nock(contentfulHost)
        .get(
          `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries?${query}`,
        )
        .reply(404);

      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return news', async () => {
      nock(contentfulHost)
        .get(
          `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
        )
        .query({
          content_type: 'news',
          limit: 8,
          skip: 5,
          order: '-sys.createdAt',
        })
        .reply(200, newsContentfulApiResponse);

      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result).toEqual(getListNewsDataObject());
    });

    test('Should return news when the thumbnail is null', async () => {
      const contentfulResponse = {
        total: 1,
        items: [
          {
            ...newsContentfulApiResponse.items[0],
            fields: {
              ...newsContentfulApiResponse.items[0]?.fields,
              thumbnail: undefined,
            },
          },
        ],
      };

      nock(contentfulHost)
        .get(
          `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
        )
        .query({
          content_type: 'news',
          limit: 8,
          skip: 5,
          order: '-sys.createdAt',
        })
        .reply(200, contentfulResponse);

      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result.items[0]!.thumbnail).toBeUndefined();
    });

    test('Should query data properly when request does not have options', async () => {
      nock(contentfulHost)
        .get(
          `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
        )
        .query({
          content_type: 'news',
          order: '-sys.createdAt',
        })
        .reply(200, newsContentfulApiResponse);

      const result = await newsDataProvider.fetch();

      expect(result).toEqual(getListNewsDataObject());
    });

    describe('Frequency Filter', () => {
      test('Should query data properly when only CRN Quarterly frequency is selected', async () => {
        nock(contentfulHost)
          .get(
            `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
          )
          .query({
            content_type: 'news',
            fields: { frequency: { in: 'CRN Quarterly' } },
            limit: '8',
            skip: '5',
            order: '-sys.createdAt',
          })
          .reply(200, newsContentfulApiResponse);

        const result = await newsDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly'],
          },
        });

        expect(result).toEqual(getListNewsDataObject());
      });

      test('Should query data properly when CRN Quarterly and News Articles frequency are selected', async () => {
        nock(contentfulHost)
          .get(
            `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
          )
          .query({
            content_type: 'news',
            fields: { frequency: { in: 'CRN Quarterly,News Articles' } },
            limit: '8',
            skip: '5',
            order: '-sys.createdAt',
          })
          .reply(200, newsContentfulApiResponse);

        const result = await newsDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly', 'News Articles'],
          },
        });

        expect(result).toEqual(getListNewsDataObject());
      });
    });

    describe('Text Filter', () => {
      test('Should query data properly when passing search param and no frequency is selected', async () => {
        nock(contentfulHost)
          .get(
            `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
          )
          .query({
            content_type: 'news',
            fields: { title: { match: 'hey' } },
            order: '-sys.createdAt',
          })
          .reply(200, newsContentfulApiResponse);

        const result = await newsDataProvider.fetch({
          filter: { title: 'hey' },
        });

        expect(result).toEqual(getListNewsDataObject());
      });

      test('Should query data properly when passing search param and frequency is selected', async () => {
        nock(contentfulHost)
          .get(
            `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
          )
          .query({
            content_type: 'news',
            fields: {
              title: { match: 'hey' },
              frequency: { in: 'CRN Quarterly,News Articles' },
            },
            limit: '8',
            skip: '5',
            order: '-sys.createdAt',
          })
          .reply(200, newsContentfulApiResponse);

        const result = await newsDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly', 'News Articles'],
            title: 'hey',
          },
        });

        expect(result).toEqual(getListNewsDataObject());
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test.skip('Should return null when the news is not found', async () => {
      const id = 'some-id';

      nock(contentfulHost)
        .get(
          `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
        )
        .query({
          content_type: 'news',
          fields: {
            id,
          },
        })
        .reply(404);

      expect(await newsDataProvider.fetchById(id)).toBeNull();
    });

    test.skip('Should throw when the server responds with an error', async () => {
      const id = 'some-id';

      nock(contentfulHost)
        .get(
          `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
        )
        .query({
          content_type: 'news',
          fields: {
            id,
          },
        })
        .reply(500);

      await expect(newsDataProvider.fetchById(id)).rejects.toThrow();
    });

    test('Should return the result when the news exists', async () => {
      const id = 'some-id';

      nock(contentfulHost)
        .get(
          `/spaces/${contentfulSpaceId}/environments/${contentfulEnvId}/entries`,
        )
        .query({
          content_type: 'news',
          fields: {
            id,
          },
        })
        .reply(200, newsContentfulApiResponse);

      const result = await newsDataProvider.fetchById(id);

      expect(result).toEqual(getListNewsDataObject().items[0]);
    });
  });
});
