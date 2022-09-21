import {
  parseWorkingGroupNetworkToDataObject,
  WorkingGroupNetworkSquidexDataProvider,
} from '../../src/data-providers/working-group-network.data-provider';
import {
  getGraphQLWorkingGroupNetwork,
  getListWorkingGroupNetworkDataObject,
  getSquidexWorkingGroupNetworkGraphqlResponse,
  getWorkingGroupNetworkDataObject,
} from '../fixtures/working-group-network.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Working Group Network Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const workingGroupDataProvider = new WorkingGroupNetworkSquidexDataProvider(
    squidexGraphqlClientMock,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const workingGroupDataProviderMockGraphqlServer =
    new WorkingGroupNetworkSquidexDataProvider(squidexGraphqlClientMockServer);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should fetch the working group from squidex graphql', async () => {
      const result = await workingGroupDataProviderMockGraphqlServer.fetch();

      expect(result).toMatchObject(getListWorkingGroupNetworkDataObject());
    });

    test('Should return an empty result', async () => {
      const mockResponse = getSquidexWorkingGroupNetworkGraphqlResponse();
      mockResponse.queryWorkingGroupNetworkContents = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await workingGroupDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null items property', async () => {
      const mockResponse = getSquidexWorkingGroupNetworkGraphqlResponse();
      mockResponse.queryWorkingGroupNetworkContents = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await workingGroupDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  describe('Parsing', () => {
    test('the working group is parsed', () => {
      const workingGroup = getGraphQLWorkingGroupNetwork();
      const workingGroupDataObject =
        parseWorkingGroupNetworkToDataObject(workingGroup);
      const expected = getWorkingGroupNetworkDataObject();
      expect(workingGroupDataObject).toEqual(expected);
    });
  });
});
