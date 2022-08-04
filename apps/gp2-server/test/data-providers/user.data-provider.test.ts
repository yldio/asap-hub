import { NotFoundError } from '@asap-hub/errors';
import { FetchUsersOptions, UserResponse } from '@asap-hub/model';
import { RestUser, SquidexRest } from '@asap-hub/squidex';
import nock, { DataMatcherMap } from 'nock';
import { appName, baseUrl } from '../../src/config';
import {
  GraphqlUserTeam,
  parseGraphQLUserTeamConnections,
  parseUserToDataObject,
  parseUserToResponse,
  UserSquidexDataProvider,
} from '../../src/data-providers/user.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import logger from '../../src/utils/logger';
import {
  fetchUserResponse,
  fetchUserResponseDataObject,
  getGraphQLUser,
  getSquidexUserGraphqlResponse,
  getSquidexUsersGraphqlResponse,
  getUserDataObject,
} from '../fixtures/user.fixtures';
import { identity } from '../helpers/squidex';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('User data provider', () => {
  const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
    appName,
    baseUrl,
  });
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
    // const usersMockGraphqlServer = new Users(squidexGraphqlClientMockServer);
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
  });
  describe('update', () => {
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
          teams: { iv: [{ id: 'team-id', role: 'Project Manager' }] },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse()); // this response is ignored

      const result = await userDataProvider.update(userId, {
        teams: [{ id: 'team-id', role: 'Project Manager' }],
      });
      expect(nock.isDone()).toBe(true);
      expect(result).not.toBeDefined();
    });
  });
  describe('Fetch', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
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

    test('Should query with filters and return the users', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 12,
        skip: 2,
        search: 'first last',
        filter: {
          role: ['role', 'Staff'],
          labId: ['lab-123', 'lab-456'],
          teamId: ['team-123', 'team-456'],
        },
      };
      const users = await userDataProvider.fetch(fetchOptions);

      const filterQuery =
        "(data/teams/iv/id eq 'team-123' or data/teams/iv/id eq 'team-456')" +
        ' and' +
        " (data/teams/iv/role eq 'role' or data/teams/iv/role eq 'Staff')" +
        ' and' +
        " (data/labs/iv eq 'lab-123' or data/labs/iv eq 'lab-456')" +
        ' and' +
        ' data/onboarded/iv eq true' +
        ' and' +
        " data/role/iv ne 'Hidden'" +
        ' and' +
        " ((contains(data/firstName/iv, 'first')" +
        " or contains(data/lastName/iv, 'first')" +
        " or contains(data/institution/iv, 'first')" +
        " or contains(data/expertiseAndResourceTags/iv, 'first'))" +
        ' and' +
        " (contains(data/firstName/iv, 'last')" +
        " or contains(data/lastName/iv, 'last')" +
        " or contains(data/institution/iv, 'last')" +
        " or contains(data/expertiseAndResourceTags/iv, 'last')))";
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
    test('Should sanitise single quotes by doubling them and encoding to hex', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 12,
        skip: 2,
        search: "'",
      };
      await userDataProvider.fetch(fetchOptions);

      const expectedFilter =
        "data/onboarded/iv eq true and data/role/iv ne 'Hidden' and" +
        " ((contains(data/firstName/iv, '%27%27')" +
        " or contains(data/lastName/iv, '%27%27')" +
        " or contains(data/institution/iv, '%27%27')" +
        " or contains(data/expertiseAndResourceTags/iv, '%27%27')))";

      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 12,
          skip: 2,
          filter: expectedFilter,
        },
      );
    });
    test('Should sanitise double quotation mark by encoding to hex', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 12,
        skip: 2,
        search: '"',
      };
      await userDataProvider.fetch(fetchOptions);

      const expectedFilter =
        "data/onboarded/iv eq true and data/role/iv ne 'Hidden' and" +
        " ((contains(data/firstName/iv, '%22')" +
        " or contains(data/lastName/iv, '%22')" +
        " or contains(data/institution/iv, '%22')" +
        " or contains(data/expertiseAndResourceTags/iv, '%22')))";

      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 12,
          skip: 2,
          filter: expectedFilter,
        },
      );
    });
    test('Should search with special characters', async () => {
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        getSquidexUsersGraphqlResponse(),
      );
      const fetchOptions: FetchUsersOptions = {
        take: 12,
        skip: 2,
        search: 'Solène',
      };
      await userDataProvider.fetch(fetchOptions);

      const expectedFilter =
        "data/onboarded/iv eq true and data/role/iv ne 'Hidden' and" +
        " ((contains(data/firstName/iv, 'Solène')" +
        " or contains(data/lastName/iv, 'Solène')" +
        " or contains(data/institution/iv, 'Solène')" +
        " or contains(data/expertiseAndResourceTags/iv, 'Solène')))";

      expect(squidexGraphqlClientMock.request).toBeCalledWith(
        expect.anything(),
        {
          top: 12,
          skip: 2,
          filter: expectedFilter,
        },
      );
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
    describe('parseUserToDataObject', () => {
      test('user is parsed', () => {
        const user = fetchUserResponse();
        const userDataObject = parseUserToDataObject(user);
        expect(userDataObject).toEqual(fetchUserResponseDataObject());
      });
      test('empty teams is parsed', () => {
        const user = fetchUserResponse();
        user.data.teams.iv = null;
        const userDataObject = parseUserToDataObject(user);
        const expected = {
          ...fetchUserResponseDataObject(),
          teams: [],
        };
        expect(userDataObject).toEqual(expected);
      });
      test('parsing of labs', () => {
        const user = fetchUserResponse();
        user.data.labs.iv = [
          {
            id: 'labs/1',
            flatData: { name: 'lab1' },
          },
        ];
        const userDataObject = parseUserToDataObject(user);
        const expected = {
          ...fetchUserResponseDataObject(),
          labs: [{ id: 'labs/1', name: 'lab1' }],
        };
        expect(userDataObject).toEqual(expected);
      });
      test('parsing of labs with no name sets blank', () => {
        const user = fetchUserResponse();
        user.data.labs.iv = [
          {
            id: 'labs/1',
            flatData: {},
          },
        ];
        const userDataObject = parseUserToDataObject(user);
        const expected = {
          ...fetchUserResponseDataObject(),
          labs: [{ id: 'labs/1', name: '' }],
        };
        expect(userDataObject).toEqual(expected);
      });
    });
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
            id: 'team-id-1',
            proposal: 'proposalId1',
            role: 'Lead PI (Core Leadership)',
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
    });
  });
});
