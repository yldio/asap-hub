import { GenericError, NotFoundError } from '@asap-hub/errors';
import {
  activeUserTag,
  FetchUsersOptions,
  inactiveUserTag,
  UserResponse,
  UserDataObject,
  UserSocialLinks,
} from '@asap-hub/model';
import { InputUser, RestUser, SquidexRest } from '@asap-hub/squidex';
import nock, { DataMatcherMap } from 'nock';
import { appName, baseUrl } from '../../src/config';
import {
  GraphqlUserTeam,
  parseGraphQLUserTeamConnections,
  parseUserToResponse,
  UserSquidexDataProvider,
} from '../../src/data-providers/users.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import logger from '../../src/utils/logger';
import {
  fetchUserResponse,
  fetchUserResponseDataObject,
  getGraphQLUser,
  getInputUser,
  getSquidexUserGraphqlResponse,
  getSquidexUsersGraphqlResponse,
  getUserCreateDataObject,
  getUserDataObject,
} from '../fixtures/users.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('User data provider', () => {
  const userRestClient = new SquidexRest<RestUser, InputUser>(
    getAuthToken,
    'users',
    {
      appName,
      baseUrl,
    },
  );
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const userDataProvider = new UserSquidexDataProvider(
    squidexGraphqlClientMock,
    userRestClient,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const usersMockGraphqlServer = new UserSquidexDataProvider(
    squidexGraphqlClientMockServer,
    userRestClient,
  );
  beforeAll(() => {
    identity();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('FetchById', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await usersMockGraphqlServer.fetchById('user-id');

      expect(result).toMatchObject(getUserDataObject());
    });

    test('Should return null when the user is not found', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      expect(await userDataProvider.fetchById('not-found')).toBeNull();
    });

    test('Should return the user when they are found, even if they are not onboarded', async () => {
      const nonOnboardedUserResponse = getSquidexUserGraphqlResponse();
      nonOnboardedUserResponse.findUsersContent!.flatData.onboarded = false;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        nonOnboardedUserResponse,
      );

      const result = await userDataProvider.fetchById('user-id');

      expect(result?.id).toEqual(nonOnboardedUserResponse.findUsersContent!.id);
    });
    test('Should return the user when it finds it', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetchById('user-id');
      expect(result).toEqual(getUserDataObject());
    });

    test('Should return the user when teams is empty', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.teams = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      const expectedResponse = getUserDataObject();
      expectedResponse.teams = [];

      const result = await userDataProvider.fetchById('user-id');
      expect(result).toEqual(expectedResponse);
    });

    test('Should filter out a team when the team role is invalid', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.teams![0]!.role = 'invalid role';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      const expectedResponse = getUserDataObject();
      expectedResponse.teams = [];

      const result = await userDataProvider.fetchById('user-id');
      expect(result).toEqual(expectedResponse);
    });
    test('Should skip the user lab if it does not have a name', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.labs = [
        {
          id: 'lab1',
          flatData: {
            name: 'lab 1',
          },
        },
        {
          id: 'lab2',
          flatData: {
            name: null,
          },
        },
        {
          id: 'lab3',
          flatData: {
            name: 'lab 3',
          },
        },
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetchById('user-id');

      expect(result?.labs).toEqual([
        {
          id: 'lab1',
          name: 'lab 1',
        },
        {
          id: 'lab3',
          name: 'lab 3',
        },
      ]);
    });
    test('Should skip the user orcid work if it does not have an ID or a lastModifiedDate', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.orcidWorks = [
        {
          id: 'id1',
          doi: 'doi1',
          lastModifiedDate: 'lastModifiedDate1',
          publicationDate: 'publicationDate1',
          title: 'title1',
          type: 'ANNOTATION',
        },
        {
          id: null,
          doi: 'doi2',
          lastModifiedDate: 'lastModifiedDate2',
          publicationDate: 'publicationDate2',
          title: 'title2',
          type: 'ANNOTATION',
        },
        {
          id: 'id3',
          doi: 'doi3',
          lastModifiedDate: 'lastModifiedDate3',
          publicationDate: 'publicationDate3',
          title: 'title3',
          type: 'ANNOTATION',
        },
        {
          id: 'id4',
          doi: 'doi4',
          lastModifiedDate: null,
          publicationDate: 'publicationDate4',
          title: 'title4',
          type: 'ANNOTATION',
        },
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetchById('user-id');

      expect(result?.orcidWorks).toMatchObject([
        {
          id: 'id1',
        },
        {
          id: 'id3',
        },
      ]);
    });
    test('Should default the user orcid work type to UNDEFINED if it is not present or invalid', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.orcidWorks = [
        {
          id: 'id1',
          doi: 'doi1',
          lastModifiedDate: 'lastModifiedDate1',
          publicationDate: 'publicationDate1',
          title: 'title1',
          type: null,
        },
        {
          id: 'id2',
          doi: 'doi2',
          lastModifiedDate: 'lastModifiedDate2',
          publicationDate: 'publicationDate2',
          title: 'title2',
          type: 'invalid',
        },
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetchById('user-id');

      expect(result?.orcidWorks).toMatchObject([
        {
          id: 'id1',
          type: 'UNDEFINED',
        },
        {
          id: 'id2',
          type: 'UNDEFINED',
        },
      ]);
    });
    test('Should return the valid publication date', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.orcidWorks = [
        {
          id: 'id1',
          doi: 'doi1',
          lastModifiedDate: 'lastModifiedDate1',
          publicationDate: {
            year: '2020',
            month: '09',
            day: '08',
          },
          title: 'title1',
          type: 'ANNOTATION',
        },
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetchById('user-id');

      const expectedOrcidWorksPublicationDate: NonNullable<
        UserResponse['orcidWorks']
      >[number]['publicationDate'] = {
        year: '2020',
        month: '09',
        day: '08',
      };

      expect(result?.orcidWorks![0]!.publicationDate).toEqual(
        expectedOrcidWorksPublicationDate,
      );
    });
    test('Should default the publication to an empty object when it is not valid', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.orcidWorks = [
        {
          id: 'id1',
          doi: 'doi1',
          lastModifiedDate: 'lastModifiedDate1',
          title: 'title1',
          publicationDate: {
            year: {
              Type: 5,
            },
            month: {
              Type: 5,
            },
            day: {
              Type: 5,
            },
          },
          type: 'ANNOTATION',
        },
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetchById('user-id');

      const expectedOrcidWorksPublicationDate: NonNullable<
        UserResponse['orcidWorks']
      >[number]['publicationDate'] = {};

      expect(result?.orcidWorks![0]!.publicationDate).toEqual(
        expectedOrcidWorksPublicationDate,
      );
    });
    test('Should provide connected working groups', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.id = 'user-id-1';
      mockResponse.findUsersContent!.referencingWorkingGroupsContents = [
        {
          id: 'wg-1',
          flatData: {
            title: 'WG ONE',
            complete: false,
            leaders: [
              {
                user: [{ id: 'user-id-1' }],
                role: 'Chair',
              },
            ],
            members: [],
          },
        },
        {
          id: 'wg-2',
          flatData: {
            title: 'WG TWO',
            complete: false,
            leaders: [],
            members: [{ user: [{ id: 'user-id-1' }] }],
          },
        },
        {
          id: 'wg-3',
          flatData: {
            title: 'WG THREE',
            complete: true,
            leaders: [],
            members: [{ user: [{ id: 'user-id-1' }] }],
          },
        },
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      const expectedResponse = getUserDataObject();
      expectedResponse.workingGroups = [
        { id: 'wg-1', name: 'WG ONE', role: 'Chair', active: true },
        { id: 'wg-2', name: 'WG TWO', role: 'Member', active: true },
        { id: 'wg-3', name: 'WG THREE', role: 'Member', active: false },
      ];
      const result = await userDataProvider.fetchById('user-1');
      expect(result).toEqual(expectedResponse);
    });
    test('Should provide alumni values when they exist', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.alumniSinceDate =
        '2020-10-26T15:33:18Z';
      mockResponse.findUsersContent!.flatData.alumniLocation =
        'Some University in London';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      const expectedResponse = getUserDataObject();
      expectedResponse.alumniSinceDate = '2020-10-26T15:33:18Z';
      expectedResponse.alumniLocation = 'Some University in London';
      expectedResponse._tags = [inactiveUserTag];
      const result = await userDataProvider.fetchById('user-id');
      expect(result).toEqual(expectedResponse);
    });
    test.each([
      {
        userType: 'alumni',
        alumniSinceDate: '2020-10-26T15:33:18Z',
        tagValue: inactiveUserTag,
      },
      {
        userType: 'non-alumni',
        alumniSinceDate: null,
        tagValue: activeUserTag,
      },
    ])(
      'Should return _tags correctly for $userType user',
      async ({ alumniSinceDate, tagValue }) => {
        const mockResponse = getSquidexUserGraphqlResponse();
        mockResponse.findUsersContent!.flatData.alumniSinceDate =
          alumniSinceDate;
        squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

        const result = await userDataProvider.fetchById('user-id');

        expect(result?._tags).toEqual([tagValue]);
      },
    );

    describe('default values', () => {
      const stringFields = {
        email: null,
        firstName: null,
        lastName: null,
      };
      const fields = {
        contactEmail: null,
        biography: null,
        jobTitle: null,
        city: null,
        country: null,
        institution: null,
        orcid: null,
        orcidLastModifiedDate: null,
        orcidLastSyncDate: null,
        alumniLocation: null,
        alumniSinceDate: null,
        reachOut: null,
        researchInterests: null,
        responsibilities: null,
        expertiseAndResourceDescription: null,
      };
      const social = {
        website1: null,
        website2: null,
        linkedIn: null,
        orcid: null,
        researcherId: null,
        twitter: null,
        github: null,
        googleScholar: null,
        researchGate: null,
      };

      let result: UserDataObject | null = null;

      beforeAll(async () => {
        const mockResponse = getSquidexUserGraphqlResponse();
        mockResponse.findUsersContent!.flatData = {
          ...mockResponse.findUsersContent!.flatData,
          ...stringFields,
          ...fields,
          social: [social],
        };
        squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

        result = await userDataProvider.fetchById('123');
      });

      test.each(Object.keys(stringFields) as (keyof UserDataObject)[])(
        '%s should default null value to an empty string',
        async (key) => {
          expect(result?.[key]).toEqual('');
        },
      );
      test.each(Object.keys(fields) as (keyof UserDataObject)[])(
        '%s should default null value to undefined',
        async (key) => {
          expect(result?.[key]).toBeUndefined();
        },
      );
      test.each(Object.keys(social) as (keyof UserSocialLinks)[])(
        'social.%s should default null value to undefined',
        async (key) => {
          expect(result?.social?.[key]).toBeUndefined();
        },
      );
    });
  });

  describe('Update', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    const userId = 'user-id';
    test('Should throw when sync asset fails', async () => {
      nock(baseUrl)
        .patch(`/api/content/${appName}/users/${userId}`, {
          jobTitle: { iv: 'CEO' },
        })
        .reply(404);

      await expect(
        userDataProvider.update(userId, { jobTitle: 'CEO' }),
      ).rejects.toThrow(NotFoundError);
      expect(nock.isDone()).toBe(true);
    });
    test('Should update job title through a clean-update', async () => {
      nock(baseUrl)
        .patch(`/api/content/${appName}/users/${userId}`, {
          jobTitle: { iv: 'CEO' },
        })
        .reply(200, fetchUserResponse());

      expect(
        await userDataProvider.update(userId, { jobTitle: 'CEO' }),
      ).not.toBeDefined();
      expect(nock.isDone()).toBe(true);
    });
    test('Should update the country and city through a clean-update', async () => {
      nock(baseUrl)
        .patch(`/api/content/${appName}/users/${userId}`, {
          country: { iv: 'United Kingdom' },
          city: { iv: 'Brighton' },
        })
        .reply(200, fetchUserResponse());
      expect(
        await userDataProvider.update(userId, {
          country: 'United Kingdom',
          city: 'Brighton',
        }),
      ).not.toBeDefined();
      expect(nock.isDone()).toBe(true);
    });
    test('Should delete user fields', async () => {
      const mockResponse = getUserDataObject();

      delete mockResponse.contactEmail;
      nock(baseUrl)
        .get(`/api/content/${appName}/users/${userId}`)
        .reply(200, fetchUserResponse())
        .put(`/api/content/${appName}/users/${userId}`, {
          ...fetchUserResponse().data,
          contactEmail: { iv: null },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse); // this response is ignored

      const result = await userDataProvider.update(userId, {
        contactEmail: '',
      });
      expect(result).not.toBeDefined();
      expect(nock.isDone()).toBe(true);
    });
    test('Should update social and questions', async () => {
      nock(baseUrl)
        .patch(`/api/content/${appName}/users/${userId}`, {
          questions: { iv: [{ question: 'To be or not to be?' }] },
          social: { iv: [{ github: 'johnytiago' }] },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse());

      const result = await userDataProvider.update(userId, {
        questions: ['To be or not to be?'],
        social: {
          github: 'johnytiago',
        },
      });
      expect(nock.isDone()).toBe(true);
      expect(result).not.toBeDefined();
    });
    test('Should update Research Interests and Responsibility', async () => {
      const expectedPatchRequest: Partial<RestUser['data']> = {
        researchInterests: {
          iv: 'new research interests',
        },
        responsibilities: {
          iv: 'new responsibilities',
        },
      };

      nock(baseUrl)
        .patch(
          `/api/content/${appName}/users/${userId}`,
          expectedPatchRequest as DataMatcherMap,
        )
        .reply(200, fetchUserResponse());

      const result = await userDataProvider.update(userId, {
        researchInterests: 'new research interests',
        responsibilities: 'new responsibilities',
      });
      expect(nock.isDone()).toBe(true);
      expect(result).not.toBeDefined();
    });
    test('should call put when teams is populated', async () => {
      const mockResponse = getUserDataObject();
      mockResponse.teams = [{ id: 'team-id', role: 'Key Personnel' }];
      nock(baseUrl)
        .get(`/api/content/${appName}/users/${userId}`)
        .reply(200, fetchUserResponse())
        .put(`/api/content/${appName}/users/${userId}`, {
          ...fetchUserResponse().data,
          teams: { iv: [{ id: 'team-id', role: 'Key Personnel' }] },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse()); // this response is ignored

      const result = await userDataProvider.update(userId, {
        teams: [{ id: 'team-id', role: 'Key Personnel' }],
      });
      expect(nock.isDone()).toBe(true);
      expect(result).not.toBeDefined();
    });
  });

  describe('Create', () => {
    const userId = 'some-user-id';

    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should create a user', async () => {
      const userCreateDataObject = getUserCreateDataObject();

      nock(baseUrl)
        .post(`/api/content/${appName}/users?publish=true`, {
          ...(getInputUser() as any),
        })
        .reply(201, { id: userId });

      const result = await userDataProvider.create(userCreateDataObject);
      expect(result).toEqual(userId);
    });

    test('Should create a user with no team', async () => {
      const userCreateDataObject = {
        ...getUserCreateDataObject(),
        teams: undefined,
      };
      const inputWithNoTeams = {
        ...(getInputUser() as any),
        teams: {
          iv: [],
        },
      };

      nock(baseUrl)
        .post(`/api/content/${appName}/users?publish=true`, inputWithNoTeams)
        .reply(201, { id: userId });

      const result = await userDataProvider.create(userCreateDataObject);
      expect(result).toEqual(userId);
    });

    test('Should throw when it fails to create the user', async () => {
      nock(baseUrl)
        .post(`/api/content/${appName}/users?publish=true`)
        .reply(500);

      await expect(
        userDataProvider.create(getUserCreateDataObject()),
      ).rejects.toThrow(GenericError);
    });
  });

  describe('Fetch', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await usersMockGraphqlServer.fetch({});

      expect(result).toMatchObject({ total: 1, items: [getUserDataObject()] });
    });

    test('Should return an empty result', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal!.items = [];
      mockResponse.queryUsersContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await userDataProvider.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should query with lab filters and return the users', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 12,
        skip: 2,
        filter: {
          labId: 'lab-123',
        },
      };
      const users = await userDataProvider.fetch(fetchOptions);

      const filterQuery =
        "data/labs/iv eq 'lab-123'" +
        ' and' +
        ' data/onboarded/iv eq true' +
        ' and' +
        " not(data/role/iv eq 'Hidden')";
      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 12,
          skip: 2,
          filter: filterQuery,
        },
      );
      expect(users).toMatchObject({ total: 1, items: [getUserDataObject()] });
    });

    test('Should query with team filters and return the users', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 12,
        skip: 2,
        filter: {
          role: ['role', 'Staff'],
          teamId: 'team-123',
        },
      };
      const users = await userDataProvider.fetch(fetchOptions);

      const filterQuery =
        "data/teams/iv/id eq 'team-123'" +
        ' and' +
        " ((data/teams/iv/role eq 'role') or (data/teams/iv/role eq 'Staff'))" +
        ' and' +
        ' data/onboarded/iv eq true' +
        ' and' +
        " not(data/role/iv eq 'Hidden')";
      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 12,
          skip: 2,
          filter: filterQuery,
        },
      );
      expect(users).toMatchObject({ total: 1, items: [getUserDataObject()] });
    });

    test('Should query with code filters and return the users', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 1,
        skip: 0,
        filter: {
          onboarded: false,
          hidden: false,
          code: 'a-code',
        },
      };
      const users = await userDataProvider.fetch(fetchOptions);

      const filterQuery = "data/connections/iv/code eq 'a-code'";
      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 1,
          skip: 0,
          filter: filterQuery,
        },
      );
      expect(users).toMatchObject({ total: 1, items: [getUserDataObject()] });
    });
  });
  describe('parsing', () => {
    describe('parseGraphQLUserTeamConnections', () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      test('should return an empty array if there are no teams', () => {
        const teams: GraphqlUserTeam[] = [];
        const parsedTeams = parseGraphQLUserTeamConnections(teams);
        expect(parsedTeams).toEqual([]);
      });
      test('should return an empty array if there are  teams are not defined', () => {
        const teams: GraphqlUserTeam[] = [];
        const parsedTeams = parseGraphQLUserTeamConnections(teams);
        expect(parsedTeams).toEqual([]);
      });

      test('should parse user team connections', () => {
        const teams: GraphqlUserTeam[] = getGraphQLUser().flatData.teams!;
        const parsedTeams = parseGraphQLUserTeamConnections(teams);
        expect(parsedTeams).toEqual([
          {
            displayName: 'Team A',
            teamInactiveSince: '',
            id: 'team-id-0',
            proposal: 'proposalId1',
            role: 'Lead PI (Core Leadership)',
            inactiveSinceDate: undefined,
          },
        ]);
      });

      test('should filter out teams where id is null', () => {
        const teams: GraphqlUserTeam[] = getGraphQLUser().flatData.teams!;
        teams[0]!.id = null;
        const loggerWarnSpy = jest.spyOn(logger, 'warn');
        const parsedTeams = parseGraphQLUserTeamConnections(teams);
        expect(loggerWarnSpy).toHaveBeenCalledWith(
          `Team Connection is undefined`,
        );
        expect(parsedTeams).toEqual([]);
      });

      test('should filter out teams when team role is invalid', () => {
        const teams: GraphqlUserTeam[] = getGraphQLUser().flatData.teams!;
        teams[0]!.role = 'invalid role';
        const loggerWarnSpy = jest.spyOn(logger, 'warn');
        const parsedTeams = parseGraphQLUserTeamConnections(teams);
        expect(loggerWarnSpy).toHaveBeenCalledWith(
          `Invalid team role: invalid role`,
        );
        expect(parsedTeams).toEqual([]);
      });
    });
    describe('parseUserToResponse', () => {
      test('adds display name', () => {
        const given = fetchUserResponseDataObject();
        const result = parseUserToResponse({
          ...given,
          lastName: 'last-name',
          firstName: 'first-name',
        });
        expect(result.displayName).toEqual('first-name last-name');
      });
      test('removes connection', () => {
        const given = fetchUserResponseDataObject();
        const result = parseUserToResponse({
          ...given,
          connections: [{ code: 'a connection' }],
        });
        expect((result as any).connections).not.toBeDefined();
      });
      test('correctly parses whether the user has dismissed getting started', () => {
        const given = fetchUserResponseDataObject();
        const result = parseUserToResponse({
          ...given,
          dismissedGettingStarted: true,
        });
        expect(result.dismissedGettingStarted).toEqual(true);

        const secondResult = parseUserToResponse({
          ...given,
          dismissedGettingStarted: false,
        });
        expect(secondResult.dismissedGettingStarted).toEqual(false);

        const thirdResult = parseUserToResponse({
          ...given,
          dismissedGettingStarted: undefined,
        });
        expect(thirdResult.dismissedGettingStarted).toEqual(false);
      });
    });
  });
});
