import { WorkingGroupSquidexDataProvider } from '../../src/data-providers/working-group.data-provider';
import {
  getGraphQLWorkingGroup,
  getListWorkingGroupDataObject,
  getSquidexWorkingGroupGraphqlResponse,
} from '../fixtures/working-group.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Working Group Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const workingGroupDataProvider = new WorkingGroupSquidexDataProvider(
    squidexGraphqlClientMock,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const workingGroupDataProviderMockGraphqlServer =
    new WorkingGroupSquidexDataProvider(squidexGraphqlClientMockServer);

  beforeAll(() => {
    identity();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await workingGroupDataProviderMockGraphqlServer.fetch();

      expect(result).toMatchObject(getListWorkingGroupDataObject());
    });

    test('Should return an empty result', async () => {
      const mockResponse = getSquidexWorkingGroupGraphqlResponse();
      mockResponse.queryWorkingGroupsContentsWithTotal!.items = [];
      mockResponse.queryWorkingGroupsContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await workingGroupDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null items property', async () => {
      const mockResponse = getSquidexWorkingGroupGraphqlResponse();
      mockResponse.queryWorkingGroupsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await workingGroupDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result if the client returns a response with a null query property', async () => {
      const mockResponse = getSquidexWorkingGroupGraphqlResponse();
      mockResponse.queryWorkingGroupsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await workingGroupDataProvider.fetch();
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should default null title, shortDescription and leadingMembers to an empty string', async () => {
      const mockResponse = getSquidexWorkingGroupGraphqlResponse();
      const workingGroup = getGraphQLWorkingGroup();
      workingGroup.flatData.title = null;
      workingGroup.flatData.shortDescription = null;
      workingGroup.flatData.leadingMembers = null;
      mockResponse.queryWorkingGroupsContentsWithTotal!.items = [workingGroup];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const { items } = await workingGroupDataProvider.fetch();
      expect(items[0]).toMatchObject({
        title: '',
        shortDescription: '',
        leadingMembers: '',
      });
    });
  });
});
