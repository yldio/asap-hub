import { appName, baseUrl } from '../../src/config';
import {
  parseWorkingGroupToDataObject,
  WorkingGroupSquidexDataProvider,
} from '../../src/data-providers/working-group.data-provider';
import {
  getGraphQLWorkingGroup,
  getListWorkingGroupDataObject,
  getSquidexWorkingGroupGraphqlResponse,
  getWorkingGroupDataObject,
} from '../fixtures/working-group.fixtures';
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

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch', () => {
    test('Should fetch the working group from squidex graphql', async () => {
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

    describe('Parsing', () => {
      test('the working group is parsed', () => {
        const workingGroup = getGraphQLWorkingGroup();
        const workingGroupDataObject =
          parseWorkingGroupToDataObject(workingGroup);
        const expected = getWorkingGroupDataObject();
        expect(workingGroupDataObject).toEqual(expected);
      });

      test('the members in working group are parsed', () => {
        const workingGroup = getGraphQLWorkingGroup();
        workingGroup.flatData.members = [
          {
            role: 'Lead',
            user: [
              {
                id: '42',
                created: '2021-01-01T00:00:00Z',
                lastModified: '2021-01-01T00:00:00Z',
                version: 1,
                flatData: {
                  firstName: 'Tony',
                  lastName: 'Stark',
                  avatar: null,
                },
              },
            ],
          },
        ];
        const { members } = parseWorkingGroupToDataObject(workingGroup);
        expect(members).toEqual([
          {
            userId: '42',
            role: 'Lead',
            firstName: 'Tony',
            lastName: 'Stark',
          },
        ]);
      });

      test('avatar urls are added if available', () => {
        const workingGroup = getGraphQLWorkingGroup();
        workingGroup.flatData.members = [
          {
            role: 'Lead',
            user: [
              {
                id: '42',
                created: '2021-01-01T00:00:00Z',
                lastModified: '2021-01-01T00:00:00Z',
                version: 1,
                flatData: {
                  firstName: 'Tony',
                  lastName: 'Stark',
                  avatar: [{ id: 'avatar-id' }],
                },
              },
            ],
          },
        ];
        const { members } = parseWorkingGroupToDataObject(workingGroup);
        expect(members[0]?.avatarUrl).toEqual(
          `${baseUrl}/api/assets/${appName}/avatar-id`,
        );
      });

      test('invalid role', () => {
        const workingGroup = getGraphQLWorkingGroup();
        workingGroup.flatData.members = [
          {
            role: 'something else',
            user: [
              {
                id: '42',
                created: '2021-01-01T00:00:00Z',
                lastModified: '2021-01-01T00:00:00Z',
                version: 1,
                flatData: {
                  firstName: 'Tony',
                  lastName: 'Stark',
                  avatar: null,
                },
              },
            ],
          },
        ];
        expect(() =>
          parseWorkingGroupToDataObject(workingGroup),
        ).toThrowErrorMatchingInlineSnapshot(
          '"Invalid working group role on members : something else"',
        );
      });

      test('should skip the user from the result if the user property is undefined', () => {
        const workingGroup = getGraphQLWorkingGroup();
        workingGroup.flatData.members = [
          {
            role: 'Lead',
            user: undefined!,
          },
        ];
        const { members } = parseWorkingGroupToDataObject(workingGroup);
        expect(members).toEqual([]);
      });
    });
  });
});
