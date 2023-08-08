import {
  gp2 as gp2Contentful,
  getGP2ContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { GraphQLError } from 'graphql';
import { NewsContentfulDataProvider } from '../../src/data-providers/news.data-provider';
import {
  getContentfulGraphqlNews,
  getContentfulNewsGraphqlResponse,
  getListNewsDataObject,
} from '../fixtures/news.fixtures';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';

describe('News data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const newsDataProvider = new NewsContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      News: () => getContentfulGraphqlNews(),
    });

  const newsDataProviderMockGraphql = new NewsContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  beforeEach(jest.resetAllMocks);

  describe('Fetch method', () => {
    test('Should fetch the list of news from Contentful GraphQl', async () => {
      const result = await newsDataProviderMockGraphql.fetch({});

      expect(result).toMatchObject(getListNewsDataObject());
    });

    test('Should return an empty result when no news exist', async () => {
      const contentfulGraphQLResponse = getContentfulNewsGraphqlResponse();
      contentfulGraphQLResponse.newsCollection!.total = 0;
      contentfulGraphQLResponse.newsCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await newsDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(newsDataProvider.fetch()).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse = getContentfulNewsGraphqlResponse();
      contentfulGraphQLResponse.newsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await newsDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return news', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulNewsGraphqlResponse(),
      );
      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result).toEqual(getListNewsDataObject());
    });

    test('Should query data properly when request does not have options', async () => {
      const contentfulGraphQLResponse = getContentfulNewsGraphqlResponse();
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await newsDataProvider.fetch();

      expect(result).toEqual(getListNewsDataObject());
      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        gp2Contentful.FETCH_NEWS,
        expect.objectContaining({
          limit: null,
          order: ['publishDate_DESC'],
          skip: null,
          where: { title_contains: null },
        }),
      );
    });

    describe('Search', () => {
      test('Should query data properly when passing search param', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulNewsGraphqlResponse(),
        );

        const result = await newsDataProvider.fetch({
          take: 8,
          skip: 5,
          search: 'hey',
        });

        expect(result).toEqual(getListNewsDataObject());
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_NEWS,
          expect.objectContaining({
            limit: 8,
            skip: 5,
            order: ['publishDate_DESC'],
            where: {
              title_contains: 'hey',
            },
          }),
        );
      });
    });

    describe('Type Filter', () => {
      test('Should query data properly when only News Type is selected', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulNewsGraphqlResponse(),
        );

        const result = await newsDataProvider.fetch({
          filter: { type: ['news'] },
        });

        expect(result).toEqual(getListNewsDataObject());
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_NEWS,
          expect.objectContaining({
            limit: null,
            order: ['publishDate_DESC'],
            skip: null,
            where: { type_in: ['news'], title_contains: null },
          }),
        );
      });

      test('Should query data properly when News and Update Types are selected', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulNewsGraphqlResponse(),
        );

        const result = await newsDataProvider.fetch({
          filter: { type: ['news', 'update'] },
        });

        expect(result).toEqual(getListNewsDataObject());
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_NEWS,
          expect.objectContaining({
            limit: null,
            order: ['publishDate_DESC'],
            skip: null,
            where: { type_in: ['news', 'update'], title_contains: null },
          }),
        );
      });

      test('Should query data properly when passing search param and type is selected', async () => {
        contentfulGraphqlClientMock.request.mockResolvedValueOnce(
          getContentfulNewsGraphqlResponse(),
        );

        const result = await newsDataProvider.fetch({
          search: 'new-search',
          filter: { type: ['news'] },
        });

        expect(result).toEqual(getListNewsDataObject());
        expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
          gp2Contentful.FETCH_NEWS,
          expect.objectContaining({
            limit: null,
            order: ['publishDate_DESC'],
            skip: null,
            where: { type_in: ['news'], title_contains: 'new-search' },
          }),
        );
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should throw as not implemented', async () => {
      expect.assertions(1);
      await expect(newsDataProvider.fetchById()).rejects.toThrow(
        /Method not implemented/i,
      );
    });
  });
});
