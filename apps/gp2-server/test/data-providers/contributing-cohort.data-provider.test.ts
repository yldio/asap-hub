import { ContributingCohortSquidexDataProvider } from '../../src/data-providers/contributing-cohort.data-provider';
import {
  getListContributingCohortDataObject,
  getSquidexContributingCohortGraphqlResponse,
} from '../fixtures/contributing-cohort.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('ContributingCohort data provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();

  const newsDataProvider = new ContributingCohortSquidexDataProvider(
    squidexGraphqlClientMock,
  );
  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const newsDataProviderMockGraphqlServer =
    new ContributingCohortSquidexDataProvider(squidexGraphqlClientMockServer);

  beforeAll(identity);
  beforeEach(jest.resetAllMocks);

  describe('Fetch', () => {
    test('Should fetch the project from squidex graphql', async () => {
      const result = await newsDataProviderMockGraphqlServer.fetch();

      expect(result).toMatchObject(getListContributingCohortDataObject());
    });

    test('Should return an empty result', async () => {
      const mockResponse = getSquidexContributingCohortGraphqlResponse();
      mockResponse.queryContributingCohortsContentsWithTotal!.items = [];
      mockResponse.queryContributingCohortsContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await newsDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null items property', async () => {
      const mockResponse = getSquidexContributingCohortGraphqlResponse();
      mockResponse.queryContributingCohortsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await newsDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null query property', async () => {
      const mockResponse = getSquidexContributingCohortGraphqlResponse();
      mockResponse.queryContributingCohortsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await newsDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });
  });
});
