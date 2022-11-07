import { getGraphQLClient, GraphQLClient } from '@asap-hub/contentful';
import {
  getListNewsDataObject,
  getContentfulNewsGraphqlResponse,
} from '../../fixtures/news.fixtures';
import { NewsContentfulDataProvider } from '../../../src/data-providers/contentful/news.data-provider';
import { GraphQLError } from 'graphql';

const isContentfulResponse = true;

describe('News data provider', () => {
  let newsGraphQLClientMock = getGraphQLClient({
    space: 'space-id',
    accessToken: 'token',
    environment: 'env-is',
  }) as jest.Mocked<GraphQLClient>;

  jest.spyOn(newsGraphQLClientMock, 'request');

  const newsDataProvider = new NewsContentfulDataProvider(
    newsGraphQLClientMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should return an empty result when no news exist', async () => {
      const contentfulGraphQLResponse = getContentfulNewsGraphqlResponse();
      contentfulGraphQLResponse.newsCollection!.total = 0;
      contentfulGraphQLResponse.newsCollection!.items = [];

      newsGraphQLClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await newsDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      newsGraphQLClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(newsDataProvider.fetch()).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse = getContentfulNewsGraphqlResponse();
      contentfulGraphQLResponse.newsCollection = null;

      newsGraphQLClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await newsDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return news', async () => {
      newsGraphQLClientMock.request.mockResolvedValueOnce(
        getContentfulNewsGraphqlResponse(),
      );
      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result).toEqual(getListNewsDataObject(isContentfulResponse));
    });

    test('Should return news when the thumbnail is null', async () => {
      const contentfulGraphQLResponse = getContentfulNewsGraphqlResponse();
      contentfulGraphQLResponse.newsCollection!.total = 0;
      contentfulGraphQLResponse.newsCollection!.items[0]!.thumbnail!.url = null;

      newsGraphQLClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await newsDataProvider.fetch({ take: 8, skip: 5 });

      expect(result.items![0]!.thumbnail).toBeUndefined();
    });

    test('Should query data properly when request does not have options', async () => {
      const contentfulGraphQLResponse = getContentfulNewsGraphqlResponse();
      newsGraphQLClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await newsDataProvider.fetch();

      expect(result).toEqual(getListNewsDataObject(isContentfulResponse));
      expect(newsGraphQLClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: undefined,
          skip: undefined,
          order: ['sys_firstPublishedAt_DESC'],
          where: { frequency_in: undefined, title_contains: undefined },
        }),
      );
    });

    describe('Frequency Filter', () => {
      test('Should query data properly when only CRN Quarterly frequency is selected', async () => {
        newsGraphQLClientMock.request.mockResolvedValueOnce(
          getContentfulNewsGraphqlResponse(),
        );

        const result = await newsDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly'],
          },
        });

        expect(result).toEqual(getListNewsDataObject(isContentfulResponse));
        expect(newsGraphQLClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            skip: 5,
            order: ['sys_firstPublishedAt_DESC'],
            where: {
              frequency_in: ['CRN Quarterly'],
              title_contains: undefined,
            },
          }),
        );
      });
    });

    describe('Text Filter', () => {
      test('Should query data properly when passing search param and no frequency is selected', async () => {
        newsGraphQLClientMock.request.mockResolvedValueOnce(
          getContentfulNewsGraphqlResponse(),
        );

        const result = await newsDataProvider.fetch({
          filter: { title: 'hey' },
        });

        expect(result).toEqual(getListNewsDataObject(isContentfulResponse));
        expect(newsGraphQLClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: undefined,
            skip: undefined,
            order: ['sys_firstPublishedAt_DESC'],
            where: { frequency_in: undefined, title_contains: 'hey' },
          }),
        );
      });

      test('Should query data properly when passing search param and frequency is selected', async () => {
        newsGraphQLClientMock.request.mockResolvedValueOnce(
          getContentfulNewsGraphqlResponse(),
        );

        const result = await newsDataProvider.fetch({
          take: 8,
          skip: 5,
          filter: {
            frequency: ['CRN Quarterly', 'News Articles'],
            title: 'hey',
          },
        });

        expect(result).toEqual(getListNewsDataObject(isContentfulResponse));
        expect(newsGraphQLClientMock.request).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            limit: 8,
            skip: 5,
            order: ['sys_firstPublishedAt_DESC'],
            where: {
              frequency_in: ['CRN Quarterly', 'News Articles'],
              title_contains: 'hey',
            },
          }),
        );
      });
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should return null when the news is not found', async () => {
      const id = 'some-id';
      const contentfulGraphQLResponse = getContentfulNewsGraphqlResponse();
      contentfulGraphQLResponse.newsCollection = null;

      newsGraphQLClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      expect(await newsDataProvider.fetchById(id)).toBeNull();
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      const id = 'some-id';
      newsGraphQLClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(newsDataProvider.fetchById(id)).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return the result when the news exists', async () => {
      const id = 'some-id';
      const contentfulGraphQLResponse = getContentfulNewsGraphqlResponse();

      newsGraphQLClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await newsDataProvider.fetchById(id);

      expect(result).toEqual(
        getListNewsDataObject(isContentfulResponse).items[0],
      );
      expect(newsGraphQLClientMock.request).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          id,
        }),
      );
    });
  });
});
