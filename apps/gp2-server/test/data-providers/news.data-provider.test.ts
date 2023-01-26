import { NewsSquidexDataProvider } from '../../src/data-providers/news.data-provider';
import {
  getGraphQLNews,
  getListNewsDataObject,
  getSquidexNewsGraphqlResponse,
} from '../fixtures/news.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('News data provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();

  const newsDataProvider = new NewsSquidexDataProvider(
    squidexGraphqlClientMock,
  );
  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const newsDataProviderMockGraphqlServer = new NewsSquidexDataProvider(
    squidexGraphqlClientMockServer,
  );

  beforeAll(identity);
  beforeEach(jest.resetAllMocks);

  describe('Fetch', () => {
    test.only('Should fetch the project from squidex graphql', async () => {
      const result = await newsDataProviderMockGraphqlServer.fetch();

      expect(result).toMatchObject(getListNewsDataObject());
    });

    test('Should return an empty result', async () => {
      const mockResponse = getSquidexNewsGraphqlResponse();
      mockResponse.queryNewsAndEventsContentsWithTotal!.items = [];
      mockResponse.queryNewsAndEventsContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await newsDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null items property', async () => {
      const mockResponse = getSquidexNewsGraphqlResponse();
      mockResponse.queryNewsAndEventsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await newsDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null query property', async () => {
      const mockResponse = getSquidexNewsGraphqlResponse();
      mockResponse.queryNewsAndEventsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await newsDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return undefined if the link is not defined', async () => {
      const mockResponse = getSquidexNewsGraphqlResponse();
      const project = getGraphQLNews();
      project.flatData.link = null;
      mockResponse.queryNewsAndEventsContentsWithTotal!.items = [project];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const { items } = await newsDataProvider.fetch();
      expect(items[0]).toMatchObject({
        link: undefined,
      });
    });
    test('Should return undefined if the link text is not defined', async () => {
      const mockResponse = getSquidexNewsGraphqlResponse();
      const project = getGraphQLNews();
      project.flatData.linkText = null;
      mockResponse.queryNewsAndEventsContentsWithTotal!.items = [project];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const { items } = await newsDataProvider.fetch();
      expect(items[0]).toMatchObject({
        linkText: undefined,
      });
    });
  });
});
