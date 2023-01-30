import { GenericError } from '@asap-hub/errors';
import { SquidexRest, gp2 as gp2Squidex } from '@asap-hub/squidex';
import nock from 'nock';
import { appName, baseUrl } from '../../src/config';
import { ContributingCohortSquidexDataProvider } from '../../src/data-providers/contributing-cohort.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import {
  fetchContributingCohortResponse,
  getContributingCohortCreateDataObject,
  getContributingCohortInput,
  getListContributingCohortDataObject,
  getSquidexContributingCohortGraphqlResponse,
} from '../fixtures/contributing-cohort.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('ContributingCohort data provider', () => {
  const contributingCohortRestClient = new SquidexRest<
    gp2Squidex.RestContributingCohort,
    gp2Squidex.InputContributingCohort
  >(getAuthToken, 'contributing-cohorts', {
    appName,
    baseUrl,
  });
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();

  const contributingCohortDataProvider =
    new ContributingCohortSquidexDataProvider(
      squidexGraphqlClientMock,
      contributingCohortRestClient,
    );
  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const contributingCohortDataProviderMockGraphqlServer =
    new ContributingCohortSquidexDataProvider(
      squidexGraphqlClientMockServer,
      contributingCohortRestClient,
    );

  beforeAll(identity);
  beforeEach(jest.resetAllMocks);

  describe('Fetch', () => {
    test('Should fetch the project from squidex graphql', async () => {
      const result =
        await contributingCohortDataProviderMockGraphqlServer.fetch();

      expect(result).toMatchObject(getListContributingCohortDataObject());
    });

    test('Should return an empty result', async () => {
      const mockResponse = getSquidexContributingCohortGraphqlResponse();
      mockResponse.queryContributingCohortsContentsWithTotal!.items = [];
      mockResponse.queryContributingCohortsContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await contributingCohortDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null items property', async () => {
      const mockResponse = getSquidexContributingCohortGraphqlResponse();
      mockResponse.queryContributingCohortsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await contributingCohortDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null query property', async () => {
      const mockResponse = getSquidexContributingCohortGraphqlResponse();
      mockResponse.queryContributingCohortsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await contributingCohortDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });
  });
  describe('Create', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should throw when the POST request to squidex fails', async () => {
      nock(baseUrl)
        .post(`/api/content/${appName}/contributing-cohorts?publish=true`)
        .reply(500);

      await expect(
        contributingCohortDataProvider.create(
          getContributingCohortCreateDataObject(),
        ),
      ).rejects.toThrow(GenericError);
    });

    test('Should create the contributing cohort', async () => {
      const cohortResponse = fetchContributingCohortResponse();
      const cohortCreateDataObject = getContributingCohortCreateDataObject();

      nock(baseUrl)
        .post(
          `/api/content/${appName}/contributing-cohorts?publish=true`,
          getContributingCohortInput(),
        )
        .reply(200, cohortResponse);

      const response = await contributingCohortDataProvider.create(
        cohortCreateDataObject,
      );

      expect(response).toEqual(cohortResponse.id);
    });
  });
});
