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
    test('Should fetch the working group network from squidex graphql', async () => {
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
    test('the working group network is parsed', () => {
      const workingGroupNetwork = getGraphQLWorkingGroupNetwork();
      const workingGroupNetworkDataObject =
        parseWorkingGroupNetworkToDataObject(workingGroupNetwork);
      const expected = getWorkingGroupNetworkDataObject();
      expect(workingGroupNetworkDataObject).toEqual(expected);
    });

    test('empty array returned when network role not found in response', () => {
      const workingGroupNetwork = getGraphQLWorkingGroupNetwork();
      workingGroupNetwork.flatData.complexDisease = null;
      const workingGroupNetworkDataObject =
        parseWorkingGroupNetworkToDataObject(workingGroupNetwork);

      const complexDiseaseWorkingGroups = workingGroupNetworkDataObject
        .filter(({ role }) => role === 'complexDisease')
        .flatMap(({ workingGroups }) => workingGroups);

      expect(complexDiseaseWorkingGroups).toEqual([]);
    });
  });
});
