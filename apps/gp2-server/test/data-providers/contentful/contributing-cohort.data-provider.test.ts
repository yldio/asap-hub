import {
  Environment,
  getGP2ContentfulGraphqlClientMockServer,
} from '@asap-hub/contentful';
import { GraphQLError } from 'graphql';
import { ContributingCohortContentfulDataProvider } from '../../../src/data-providers/contentful/contributing-cohort.data-provider';
import {
  getContentfulContributingCohortsGraphqlResponse,
  getContentfulGraphqlContributingCohorts,
  getContributingCohortContentfulEntry,
  getContributingCohortCreateDataObject,
  getListContributingCohortDataObject,
} from '../../fixtures/contributing-cohort.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';

describe('Contributing Cohorts data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const environmentMock = getContentfulEnvironmentMock();

  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const contributingCohortsDataProvider =
    new ContributingCohortContentfulDataProvider(
      contentfulGraphqlClientMock,
      contentfulRestClientMock,
    );

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      ContributingCohorts: () => getContentfulGraphqlContributingCohorts(),
    });

  const contributingCohortsDataProviderMockGraphql =
    new ContributingCohortContentfulDataProvider(
      contentfulGraphqlClientMockServer,
      contentfulRestClientMock,
    );

  afterEach(jest.resetAllMocks);

  describe('Fetch method', () => {
    test('Should fetch the list of contributing cohorts from Contentful GraphQl', async () => {
      const result = await contributingCohortsDataProviderMockGraphql.fetch();

      expect(result).toMatchObject(getListContributingCohortDataObject());
    });

    test('Should return an empty result when no contributing cohorts exist', async () => {
      const contentfulGraphQLResponse =
        getContentfulContributingCohortsGraphqlResponse();
      contentfulGraphQLResponse.contributingCohortsCollection!.total = 0;
      contentfulGraphQLResponse.contributingCohortsCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await contributingCohortsDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(contributingCohortsDataProvider.fetch()).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse =
        getContentfulContributingCohortsGraphqlResponse();
      contentfulGraphQLResponse.contributingCohortsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await contributingCohortsDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return contributing cohorts', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulContributingCohortsGraphqlResponse(),
      );
      const result = await contributingCohortsDataProvider.fetch();

      expect(result).toEqual(getListContributingCohortDataObject());
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should throw as not implemented', async () => {
      expect.assertions(1);
      await expect(contributingCohortsDataProvider.fetchById()).rejects.toThrow(
        /Method not implemented/i,
      );
    });
  });

  describe('Create method', () => {
    test('Should create and publish the contributing cohort', async () => {
      const cohortMock = getContributingCohortContentfulEntry();
      const cohortCreateDataObject = getContributingCohortCreateDataObject();

      environmentMock.createEntry.mockResolvedValue(cohortMock);
      cohortMock.publish = jest.fn().mockResolvedValueOnce(cohortMock);

      const response = await contributingCohortsDataProvider.create(
        cohortCreateDataObject,
      );

      expect(environmentMock.createEntry).toHaveBeenCalledTimes(1);
      expect(environmentMock.createEntry).toHaveBeenCalledWith(
        'contributingCohorts',
        { fields: { name: { 'en-US': 'some name' } } },
      );
      expect(cohortMock.publish).toHaveBeenCalledTimes(1);
      expect(response).toEqual(cohortMock.sys.id);
    });
  });
});
