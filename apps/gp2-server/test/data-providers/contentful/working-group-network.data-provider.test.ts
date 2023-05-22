import { getGP2ContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { WorkingGroupNetworkContentfulDataProvider } from '../../../src/data-providers/contentful/working-group-network.data-provider';
import {
  getContentfulGraphqlWorkingGroupNetwork,
  getContentfulGraphqlWorkingGroupNetworkResponse,
  getListWorkingGroupNetworkDataObject,
} from '../../fixtures/working-group-network.fixtures';
import {
  getContentfulGraphqlWorkingGroupMembers,
  getContentfulGraphqlWorkingGroupMilestones,
  getContentfulGraphqlWorkingGroupResources,
} from '../../fixtures/working-group.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Working Group Network Data Provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const workingGroupDataProvider =
    new WorkingGroupNetworkContentfulDataProvider(contentfulGraphqlClientMock);

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      WorkingGroupNetwork: () => getContentfulGraphqlWorkingGroupNetwork(),
      WorkingGroupsMembersCollection: () =>
        getContentfulGraphqlWorkingGroupMembers(),
      WorkingGroupsMilestonesCollection: () =>
        getContentfulGraphqlWorkingGroupMilestones(),
      WorkingGroupsResourcesCollection: () =>
        getContentfulGraphqlWorkingGroupResources(),
    });

  const workingGroupNetworkDataProviderWithMockServer =
    new WorkingGroupNetworkContentfulDataProvider(
      contentfulGraphqlClientMockServer,
    );

  beforeEach(jest.resetAllMocks);

  describe('Fetch', () => {
    test('Should fetch the working group network from squidex graphql', async () => {
      const result =
        await workingGroupNetworkDataProviderWithMockServer.fetch();

      expect(result).toMatchObject(getListWorkingGroupNetworkDataObject());
    });

    test('Should return an empty result', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce({
        workingGroupNetwork: { total: 0, items: [] },
      });
      const result = await workingGroupDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });
    test('the working group network is parsed', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulGraphqlWorkingGroupNetworkResponse(),
      );
      const result = await workingGroupDataProvider.fetch();
      const expected = getListWorkingGroupNetworkDataObject();
      expect(result).toEqual(expected);
    });
  });
});
