import { appName, baseUrl } from '../../src/config';
import { WorkingGroupSquidexDataProvider } from '../../src/data-providers/working-groups.data-provider';
import { createUrl } from '../../src/utils/urls';
import { getGraphQLUser } from '../fixtures/users.fixtures';
import {
  getSquidexWorkingGroupGraphqlResponse,
  getSquidexWorkingGroupsGraphqlResponse,
  getWorkingGroupDataObject,
} from '../fixtures/working-groups.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';
import { getSquidexClientMock } from '../mocks/squidex-client.mock';
import { FetchWorkingGroupOptions } from '@asap-hub/model';
import { RestWorkingGroup } from '@asap-hub/squidex';

const graphqlUser = getGraphQLUser();

const parsedGraphQlWorkingGroupUser = {
  id: graphqlUser.id,
  displayName: `${graphqlUser.flatData.firstName} ${graphqlUser.flatData.lastName}`,
  firstName: graphqlUser.flatData.firstName,
  lastName: graphqlUser.flatData.lastName,
  email: graphqlUser.flatData.email,
  alumniSinceDate: graphqlUser.flatData.alumniSinceDate,
  avatarUrl: graphqlUser.flatData.avatar?.length
    ? createUrl(graphqlUser.flatData.avatar.map((a) => a.id))[0]
    : undefined,
};

describe('Working Group Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const workingGroupRestClient = getSquidexClientMock<RestWorkingGroup>();
  const workingGroupDataProvider = new WorkingGroupSquidexDataProvider(
    squidexGraphqlClientMock,
    workingGroupRestClient,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const workingGroupDataProviderMockGraphql =
    new WorkingGroupSquidexDataProvider(
      squidexGraphqlClientMockServer,
      workingGroupRestClient,
    );

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

    test('Should query with filters and return the working groups', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexWorkingGroupsGraphqlResponse(),
      );

      const fetchOptions: FetchWorkingGroupOptions = {
        take: 12,
        skip: 2,
        search: 'first last',
      };
      const expectedFilter =
        "((contains(data/title/iv,'first'))" +
        " or (contains(data/description/iv,'first'))" +
        " or (contains(data/shortText/iv,'first')))" +
        ' and' +
        " ((contains(data/title/iv,'last'))" +
        " or (contains(data/description/iv,'last'))" +
        " or (contains(data/shortText/iv,'last')))";

      const result = await workingGroupDataProvider.fetch(fetchOptions);

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: expectedFilter,
          top: 12,
          skip: 2,
        },
      );
      const expectedResult = getWorkingGroupDataObject();
      expectedResult.calendars = [];
      expect(result).toEqual({
        total: 1,
        items: [expectedResult],
      });
    });
  });

  test('Should sanitise single quotes by doubling them', async () => {
    squidexGraphqlClientMock.request.mockResolvedValueOnce(
      getSquidexWorkingGroupsGraphqlResponse(),
    );

    const fetchOptions: FetchWorkingGroupOptions = {
      take: 12,
      skip: 2,
      search: "'",
    };
    const expectedFilter =
      "((contains(data/title/iv,''''))" +
      " or (contains(data/description/iv,''''))" +
      " or (contains(data/shortText/iv,'''')))";

    await workingGroupDataProvider.fetch(fetchOptions);

    expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
      expect.anything(),
      {
        filter: expectedFilter,
        top: 12,
        skip: 2,
      },
    );
  });

  test('Should sanitise double quotation mark by escaping it', async () => {
    squidexGraphqlClientMock.request.mockResolvedValueOnce(
      getSquidexWorkingGroupsGraphqlResponse(),
    );

    const fetchOptions: FetchWorkingGroupOptions = {
      take: 12,
      skip: 2,
      search: '"',
    };
    const expectedFilter =
      "((contains(data/title/iv,'\"'))" +
      " or (contains(data/description/iv,'\"'))" +
      " or (contains(data/shortText/iv,'\"')))";

    await workingGroupDataProvider.fetch(fetchOptions);

    expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
      expect.anything(),
      {
        filter: expectedFilter,
        top: 12,
        skip: 2,
      },
    );
  });

  test.each`
    complete
    ${true}  | ${false}
  `(
    'Should filter by complete field when its value is $complete',
    async ({ complete }) => {
      squidexGraphqlClientMock.request.mockResolvedValue(
        getSquidexWorkingGroupsGraphqlResponse(),
      );

      await workingGroupDataProvider.fetch({ filter: { complete } });

      expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          filter: `data/complete/iv eq ${complete}`,
          top: 10,
          skip: 0,
        },
      );
    },
  );

  test('Should apply the complete filter', async () => {
    const complete = true;

    squidexGraphqlClientMock.request.mockResolvedValue(
      getSquidexWorkingGroupsGraphqlResponse(),
    );

    await workingGroupDataProvider.fetch({
      filter: { complete },
    });

    const completeFilter = `data/complete/iv eq ${complete}`;
    expect(squidexGraphqlClientMock.request).toHaveBeenCalledWith(
      expect.anything(),
      {
        filter: completeFilter,
        top: 10,
        skip: 0,
      },
    );
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
            user: [graphqlUser],
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
            user: parsedGraphQlWorkingGroupUser,
            workstreamRole: 'Some role',
            role: 'Chair',
          },
        ]);
      });

      test('Should return members', async () => {
        const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
        squidexGraphqlResponse.findWorkingGroupsContent!.flatData.members = [
          {
            user: [graphqlUser],
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
            user: parsedGraphQlWorkingGroupUser,
          },
        ]);
      });

      test('should return empty leaders and members if they do not exist', async () => {
        const squidexGraphqlResponse = getSquidexWorkingGroupGraphqlResponse();
        squidexGraphqlResponse.findWorkingGroupsContent!.flatData.members =
          null;
        squidexGraphqlResponse.findWorkingGroupsContent!.flatData.leaders =
          null;

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

    describe('Avatar', () => {
      test.each`
        user         | avatarText    | avatarValue              | expectedValue
        ${`members`} | ${`null`}     | ${null}                  | ${undefined}
        ${`members`} | ${`not null`} | ${[{ id: 'avatar-id' }]} | ${`${baseUrl}/api/assets/${appName}/avatar-id`}
        ${`leaders`} | ${`null`}     | ${null}                  | ${undefined}
        ${`leaders`} | ${`not null`} | ${[{ id: 'avatar-id' }]} | ${`${baseUrl}/api/assets/${appName}/avatar-id`}
      `(
        'Should parse the $user avatar correctly when the avatar is $avatarText',
        async ({
          user,
          avatarValue,
          expectedValue,
        }: {
          user: 'members' | 'leaders';
          avatarValue: { id: string }[] | null;
          expectedValue: string | undefined;
        }) => {
          const squidexGraphqlResponse =
            getSquidexWorkingGroupGraphqlResponse();
          const graphqlUser1 = getGraphQLUser();
          graphqlUser1.flatData!.avatar = avatarValue;
          if (user === 'leaders') {
            squidexGraphqlResponse.findWorkingGroupsContent!.flatData.leaders =
              [
                {
                  user: [graphqlUser1],
                  role: 'Project Manager',
                  workstreamRole: 'PM',
                },
              ];
          } else {
            squidexGraphqlResponse.findWorkingGroupsContent!.flatData.members =
              [{ user: [graphqlUser1] }];
          }

          squidexGraphqlClientMock.request.mockResolvedValueOnce(
            squidexGraphqlResponse,
          );

          const response = await workingGroupDataProvider.fetchById(
            workingGroupId,
          );

          expect(response![user][0]!.user!.avatarUrl).toEqual(expectedValue);
        },
      );
    });
  });

  describe('update method', () => {
    it('calls `patch` method on squidex rest client', async () => {
      await workingGroupDataProvider.update('123', { title: 'New title' });

      expect(workingGroupRestClient.patch).toHaveBeenCalled();
    });

    it('maps arguments to `{ iv: <arg> }` pattern expected by Squidex API', async () => {
      await workingGroupDataProvider.update('123', { title: 'New title' });

      expect(workingGroupRestClient.patch).toHaveBeenCalledWith('123', {
        title: { iv: 'New title' },
      });
    });
  });
});
