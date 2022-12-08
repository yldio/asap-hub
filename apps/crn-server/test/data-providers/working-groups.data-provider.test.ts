import { WorkingGroupSquidexDataProvider } from '../../src/data-providers/working-groups.data-provider';
import {
  getGraphQLUser,
  getSquidexUserGraphqlResponse,
} from '../fixtures/users.fixtures';
import {
  getSquidexWorkingGroupGraphqlResponse,
  getSquidexWorkingGroupsGraphqlResponse,
  getWorkingGroupDataObject,
} from '../fixtures/working-groups.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Working Group Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const workingGroupDataProvider = new WorkingGroupSquidexDataProvider(
    squidexGraphqlClientMock,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const workingGroupDataProviderMockGraphql =
    new WorkingGroupSquidexDataProvider(squidexGraphqlClientMockServer);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    test('Should fetch the working groups from squidex graphql', async () => {
      const result = await workingGroupDataProviderMockGraphql.fetch({});

      expect(result).toMatchObject({
        total: 1,
        items: [getWorkingGroupDataObject()],
      });
    });

    test('Should return an empty result when the client returns an empty list', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupsGraphqlResponse();
      squidexGraphqlResponse.queryWorkingGroupsContentsWithTotal!.total = 0;
      squidexGraphqlResponse.queryWorkingGroupsContentsWithTotal!.items = [];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await workingGroupDataProvider.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with queryWorkingGroupsContentsWithTotal property set to null', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupsGraphqlResponse();
      squidexGraphqlResponse.queryWorkingGroupsContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await workingGroupDataProvider.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupsGraphqlResponse();
      squidexGraphqlResponse.queryWorkingGroupsContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const result = await workingGroupDataProvider.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });
  });

  describe('Fetch-by-id method', () => {
    const workingGroupId = 'some-group-id';

    test('Should fetch the groups from squidex graphql', async () => {
      const result = await workingGroupDataProviderMockGraphql.fetchById(
        'group-id-1',
      );

      expect(result).toMatchObject(getWorkingGroupDataObject());
    });

    test("Should return null when the group doesn't exist", async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      expect(
        await workingGroupDataProvider.fetchById(workingGroupId),
      ).toBeNull();
    });

    test('Should return externalLink when it is not null', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response).toHaveProperty('externalLink');
    });

    test('Should not return externalLink when it is null', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.externalLink =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response).not.toHaveProperty('externalLink');
    });

    test('Should default description to an empty string', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.description =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response!.description).toBe('');
    });

    test('Should default title to an empty string', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.title = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response!.title).toBe('');
    });

    test('Should return deliverables', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.deliverables = [
        { description: 'Deliverable 1', status: 'Complete' },
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      const response = await workingGroupDataProvider.fetchById(workingGroupId);

      expect(response?.deliverables).toEqual([
        { description: 'Deliverable 1', status: 'Complete' },
      ]);
    });

    test('Should provide default values if squidex data is missing', async () => {
      const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
      squidexGraphqlResponse.findWorkingGroupsContent!.flatData.deliverables =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        squidexGraphqlResponse,
      );

      expect(
        (await workingGroupDataProvider.fetchById(workingGroupId))
          ?.deliverables,
      ).toEqual([]);
    });

    describe('leaders and members', () => {
      test('Should return leaders', async () => {
        const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
        squidexGraphqlResponse.findWorkingGroupsContent!.flatData.leaders = [
          {
            user: [getGraphQLUser()],
            workstreamRole: 'Some role',
            role: 'Chair',
          },
        ];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const response = await workingGroupDataProvider.fetchById(
          workingGroupId,
        );
        expect(response?.leaders).toStrictEqual([
          {
            user: {
              ...getSquidexUserGraphqlResponse().findUsersContent,
              ...getSquidexUserGraphqlResponse().findUsersContent?.flatData,
              displayName: 'Tom Hardy',
            },
            workstreamRole: 'Some role',
            role: 'Chair',
          },
        ]);
      });

      test('Should return members', async () => {
        const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
        squidexGraphqlResponse.findWorkingGroupsContent!.flatData.members = [
          {
            user: [getGraphQLUser()],
          },
        ];
        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const response = await workingGroupDataProvider.fetchById(
          workingGroupId,
        );
        expect(response?.members).toStrictEqual([
          {
            user: {
              ...getSquidexUserGraphqlResponse().findUsersContent,
              ...getSquidexUserGraphqlResponse().findUsersContent?.flatData,
              displayName: 'Tom Hardy',
            },
            workstreamRole: 'Some role',
          },
        ]);
      });

      test('should return empty leaders and members if they do not exist', async () => {
        const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
        squidexGraphqlResponse.findWorkingGroupsContent!.flatData.members = [];
        squidexGraphqlResponse.findWorkingGroupsContent!.flatData.leaders = [];

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const response = await workingGroupDataProvider.fetchById(
          workingGroupId,
        );
        expect(response?.members).toStrictEqual([]);
        expect(response?.leaders).toStrictEqual([]);
      });

      test('should return empty leaders and members if they are not set properly', async () => {
        const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
        squidexGraphqlResponse.findWorkingGroupsContent!.flatData.members = [
          {
            user: [],
          },
        ];
        squidexGraphqlResponse.findWorkingGroupsContent!.flatData.leaders = [
          {
            user: [],
            role: 'Chair',
            workstreamRole: 'Some role',
          },
        ];

        squidexGraphqlClientMock.request.mockResolvedValueOnce(
          squidexGraphqlResponse,
        );

        const response = await workingGroupDataProvider.fetchById(
          workingGroupId,
        );
        expect(response?.members).toStrictEqual([]);
        expect(response?.leaders).toStrictEqual([]);
      });
    });
  });
});
