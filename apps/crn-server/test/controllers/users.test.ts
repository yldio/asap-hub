import { NotFoundError } from '@asap-hub/errors';
import { config, RestUser } from '@asap-hub/squidex';
import { UserResponse } from '@asap-hub/model';
import matches from 'lodash.matches';
import nock, { DataMatcherMap } from 'nock';
import Users, { FetchUsersOptions } from '../../src/controllers/users';
import { identity } from '../helpers/squidex';
import * as orcidFixtures from '../fixtures/orcid.fixtures';
import {
  fetchUserResponse,
  getListUserResponse,
  getSquidexUserGraphqlResponse,
  getSquidexUsersGraphqlResponse,
  getUserResponse,
  patchResponse,
} from '../fixtures/users.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';
import { response } from 'express';

describe('Users controller', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const usersMockGraphqlClient = new Users(squidexGraphqlClientMock);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const usersMockGraphqlServer = new Users(squidexGraphqlClientMockServer);

  beforeAll(() => {
    identity();
  });

  describe('Fetch', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await usersMockGraphqlServer.fetch({});

      expect(result).toMatchObject(getListUserResponse());
    });

    test('Should return an empty result', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal!.items = [];
      mockResponse.queryUsersContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should return an empty result when the client returns a response with query property set to null', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
      expect(result).toEqual({ total: 0, items: [] });
    });

    test('Should return an empty result when the client returns a response with items property set to null', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal!.items = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetch({});
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
      await usersMockGraphqlClient.fetch(fetchOptions);

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
      await usersMockGraphqlClient.fetch(fetchOptions);

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
      await usersMockGraphqlClient.fetch(fetchOptions);

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
      await usersMockGraphqlClient.fetch(fetchOptions);

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
  });

  describe('FetchById', () => {
    test('Should fetch the users from squidex graphql', async () => {
      const result = await usersMockGraphqlServer.fetchById('user-id');

      expect(result).toMatchObject(getUserResponse());
    });

    test('Should throw when user is not found', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      await expect(
        usersMockGraphqlClient.fetchById('not-found'),
      ).rejects.toThrow('Not Found');
    });

    test('Should return the user when they are found, even if they are not onboarded', async () => {
      const nonOnboardedUserResponse = getSquidexUserGraphqlResponse();
      nonOnboardedUserResponse.findUsersContent!.flatData.onboarded = false;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        nonOnboardedUserResponse,
      );

      const result = await usersMockGraphqlClient.fetchById('user-id');

      expect(result.id).toEqual(nonOnboardedUserResponse.findUsersContent!.id);
    });

    test('Should return the user when it finds it', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetchById('user-id');
      expect(result).toEqual(getUserResponse());
    });

    test('Should filter out a team when the team role is invalid', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.teams![0]!.role = 'invalid role';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      const expectedResponse = getUserResponse();
      expectedResponse.teams = [];

      const result = await usersMockGraphqlClient.fetchById('user-id');
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

      const result = await usersMockGraphqlClient.fetchById('user-id');

      expect(result.labs).toEqual([
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

      const result = await usersMockGraphqlClient.fetchById('user-id');

      expect(result.orcidWorks).toMatchObject([
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

      const result = await usersMockGraphqlClient.fetchById('user-id');

      expect(result.orcidWorks).toMatchObject([
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

      const result = await usersMockGraphqlClient.fetchById('user-id');

      const expectedOrcidWorksPublicationDate: NonNullable<
        UserResponse['orcidWorks']
      >[number]['publicationDate'] = {
        year: '2020',
        month: '09',
        day: '08',
      };

      expect(result.orcidWorks![0]!.publicationDate).toEqual(
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

      const result = await usersMockGraphqlClient.fetchById('user-id');

      const expectedOrcidWorksPublicationDate: NonNullable<
        UserResponse['orcidWorks']
      >[number]['publicationDate'] = {};

      expect(result.orcidWorks![0]!.publicationDate).toEqual(
        expectedOrcidWorksPublicationDate,
      );
    });

    test('Should default onboarded flag to true when its null', async () => {
      const userWithNoOnboardedFlagResponse = getSquidexUserGraphqlResponse();
      userWithNoOnboardedFlagResponse.findUsersContent!.flatData!.onboarded =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        userWithNoOnboardedFlagResponse,
      );

      const result = await usersMockGraphqlClient.fetchById('user-id');

      expect(result.onboarded).toEqual(true);
    });

    test('Should return 0 when there are no references to Research Outputs', async () => {
      const graphqlUserResponse = getSquidexUserGraphqlResponse();
      graphqlUserResponse.findUsersContent!.referencingResearchOutputsContentsWithTotal =
        null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(
        graphqlUserResponse,
      );

      const result = await usersMockGraphqlClient.fetchById('user-id');

      expect(result.researchOutputsCount).toEqual(0);
    });
  });

  describe('fetchByCode', () => {
    const code = 'some-uuid-code';

    test('Should fetch the user by code from squidex graphql', async () => {
      const result = await usersMockGraphqlServer.fetchByCode(code);

      const { researchOutputsCount: _, ...response } = getUserResponse();
      expect(result).toMatchObject(response);
    });

    test('Should throw 403 when no user is found', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal!.items = [];
      mockResponse.queryUsersContentsWithTotal!.total = 0;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        'Forbidden',
      );
    });

    test('Should throw 403 when the query returns null', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal = null;

      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        'Forbidden',
      );
    });

    test('Should throw when it finds more than one user', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      mockResponse.queryUsersContentsWithTotal!.total = 2;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      await expect(usersMockGraphqlClient.fetchByCode(code)).rejects.toThrow(
        'Forbidden',
      );
    });

    test('Should return user when it finds it', async () => {
      const mockResponse = getSquidexUsersGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const result = await usersMockGraphqlClient.fetchByCode(code);

      const { researchOutputsCount: _, ...response } = getUserResponse();
      expect(result).toMatchObject(response);
    });
  });

  describe('update', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    const userId = 'user-id';

    test('Should throw when sync asset fails', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          jobTitle: { iv: 'CEO' },
        })
        .reply(404);

      await expect(
        usersMockGraphqlClient.update(userId, { jobTitle: 'CEO' }),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should update job title through a clean-update', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          jobTitle: { iv: 'CEO' },
        })
        .reply(200, fetchUserResponse);

      expect(
        await usersMockGraphqlClient.update(userId, { jobTitle: 'CEO' }),
      ).toEqual(getUserResponse());
    });

    test('Should update the country and city through a clean-update', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          country: { iv: 'United Kingdom' },
          city: { iv: 'Brighton' },
        })
        .reply(200, fetchUserResponse);
      expect(
        await usersMockGraphqlClient.update(userId, {
          country: 'United Kingdom',
          city: 'Brighton',
        }),
      ).toEqual(getUserResponse());
    });

    test('Should delete user fields', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.contactEmail = null;
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fetchUserResponse)
        .put(`/api/content/${config.appName}/users/${userId}`, {
          ...fetchUserResponse.data,
          contactEmail: { iv: null },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse); // this response is ignored

      const result = await usersMockGraphqlClient.update(userId, {
        contactEmail: '',
      });
      expect(result.contactEmail).not.toBeDefined();
    });

    test('Should update social and questions', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.questions = [
        { question: 'To be or not to be?' },
      ];
      mockResponse.findUsersContent!.flatData.social = [
        {
          github: 'johnytiago',
          googleScholar: null,
          linkedIn: null,
          researcherId: null,
          researchGate: null,
          twitter: null,
          website1: null,
          website2: null,
        },
      ];
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/${userId}`, {
          questions: { iv: [{ question: 'To be or not to be?' }] },
          social: { iv: [{ github: 'johnytiago' }] },
        } as { [k: string]: any })
        .reply(200, fetchUserResponse);

      const result = await usersMockGraphqlClient.update(userId, {
        questions: ['To be or not to be?'],
        social: {
          github: 'johnytiago',
        },
      });
      expect(result.questions).toEqual(['To be or not to be?']);
      expect(result.social).toEqual({
        github: 'johnytiago',
        orcid: '123-456-789',
      });
    });

    test('Should update Research Interests and Responsibility', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      mockResponse.findUsersContent!.flatData.researchInterests =
        'new research interests';
      mockResponse.findUsersContent!.flatData.responsibilities =
        'new responsibilities';
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);

      const expectedPatchRequest: Partial<RestUser['data']> = {
        researchInterests: {
          iv: 'new research interests',
        },
        responsibilities: {
          iv: 'new responsibilities',
        },
      };

      nock(config.baseUrl)
        .patch(
          `/api/content/${config.appName}/users/${userId}`,
          expectedPatchRequest as DataMatcherMap,
        )
        .reply(200, fetchUserResponse);

      const result = await usersMockGraphqlClient.update(userId, {
        researchInterests: 'new research interests',
        responsibilities: 'new responsibilities',
      });
      expect(result.researchInterests).toEqual('new research interests');
      expect(result.responsibilities).toEqual('new responsibilities');
    });
  });

  describe('updateAvatar', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should throw when sync asset fails', async () => {
      nock(config.baseUrl)
        .post(`/api/apps/${config.appName}/assets`)
        .reply(500);

      await expect(
        usersMockGraphqlClient.updateAvatar(
          'user-id',
          Buffer.from('avatar'),
          'image/jpeg',
        ),
      ).rejects.toThrow();
    });

    test('should throw when fails to update user - squidex error', async () => {
      nock(config.baseUrl)
        .post(`/api/apps/${config.appName}/assets`)
        .reply(200, { id: 'squidex-asset-id' })
        .patch(`/api/content/${config.appName}/users/user-id`, {
          avatar: { iv: ['squidex-asset-id'] },
        })
        .reply(500);

      await expect(
        usersMockGraphqlClient.updateAvatar(
          'user-id',
          Buffer.from('avatar'),
          'image/jpeg',
        ),
      ).rejects.toThrow();
    });

    test('should return 200 when syncs asset and updates users profile', async () => {
      const mockResponse = getSquidexUserGraphqlResponse();
      squidexGraphqlClientMock.request.mockResolvedValueOnce(mockResponse);
      nock(config.baseUrl)
        .post(`/api/apps/${config.appName}/assets`)
        .reply(200, { id: 'squidex-asset-id' })
        .patch(`/api/content/${config.appName}/users/user-id`, {
          avatar: { iv: ['squidex-asset-id'] },
        })
        .reply(200, patchResponse);

      const result = await usersMockGraphqlClient.updateAvatar(
        'user-id',
        Buffer.from('avatar'),
        'image/jpeg',
      );
      expect(result).toEqual(getUserResponse());
    });
  });

  describe('connectByCode', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    test('Should throw forbidden when doesn find connection code', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'invalid-code'`,
        })
        .reply(404);

      await expect(
        usersMockGraphqlClient.connectByCode('invalid-code', 'user-id'),
      ).rejects.toThrow('Forbidden');
    });

    test('Shouldnt do anything if connecting with existing code', async () => {
      const userId = 'google-oauth2|token';
      const connectedUser = JSON.parse(JSON.stringify(patchResponse));
      connectedUser.data.connections.iv = [{ code: userId }];

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'asapWelcomeCode'`,
        })
        .reply(200, { total: 1, items: [connectedUser] });

      const result = await usersMockGraphqlClient.connectByCode(
        'asapWelcomeCode',
        userId,
      );
      expect(result).toBeDefined();
    });

    test('Shouldnt do anything if connecting with existing code', async () => {
      const userId = 'google-oauth2|token';
      const connectedUser = JSON.parse(JSON.stringify(patchResponse));
      connectedUser.data.connections.iv = [{ code: userId }];
      connectedUser.data.teams = undefined;

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'asapWelcomeCode'`,
        })
        .reply(200, { total: 1, items: [connectedUser] });

      const result = await usersMockGraphqlClient.connectByCode(
        'asapWelcomeCode',
        userId,
      );
      expect(result).toBeDefined();
    });

    test('Should filter teams where teamId is undefined', async () => {
      const userId = 'google-oauth2|token';
      const connectedUser = JSON.parse(JSON.stringify(patchResponse));
      connectedUser.data.connections.iv = [{ code: userId }];
      connectedUser.data.teams.iv = [
        {
          id: [],
          role: 'Lead PI (Core Leadership)',
          approach: 'Exact',
          responsibilities: 'Make sure coverage is high',
        },
        {
          id: ['team-id-3'],
          role: 'Collaborating PI',
        },
      ];

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'asapWelcomeCode'`,
        })
        .reply(200, { total: 1, items: [connectedUser] });
      const result = await usersMockGraphqlClient.connectByCode(
        'asapWelcomeCode',
        userId,
      );
      expect(result).toBeDefined();
      expect(result.teams).toEqual([
        {
          approach: undefined,
          displayName: 'Unknown',
          id: 'team-id-3',
          responsibilities: undefined,
          role: 'Collaborating PI',
        },
      ]);
    });

    test('Should connect user', async () => {
      const userId = 'google-oauth2|token';
      const patchedUser = JSON.parse(JSON.stringify(patchResponse));
      patchedUser.data.connections.iv = [{ code: userId }];

      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users`)
        .query({
          $top: 1,
          $filter: `data/connections/iv/code eq 'asapWelcomeCode'`,
        })
        .reply(200, { total: 1, items: [patchResponse] })
        .patch(`/api/content/${config.appName}/users/${patchResponse.id}`, {
          email: { iv: patchResponse.data.email.iv },
          connections: { iv: [{ code: userId }] },
        })
        .reply(200, patchedUser);

      const result = await usersMockGraphqlClient.connectByCode(
        'asapWelcomeCode',
        userId,
      );
      expect(result).toBeDefined();
    });
  });

  describe('syncOrcidProfile', () => {
    afterEach(() => {
      expect(nock.isDone()).toBe(true);
    });

    afterEach(() => {
      nock.cleanAll();
    });

    const userId = 'userId';
    const orcid = '363-98-9330';

    test('Throws when user does not exist', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/user-not-found`)
        .reply(404);

      await expect(
        usersMockGraphqlClient.syncOrcidProfile('user-not-found'),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should update user profile even when ORCID returns 500', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fetchUserResponse)
        .patch(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fetchUserResponse);

      // times 3 because got will retry on 5XXs
      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .times(3)
        .reply(502);

      const result = await usersMockGraphqlClient.syncOrcidProfile(userId);
      expect(result).toBeDefined(); // we only care that the update is made
    });

    test('Should successfully fetch and update user - with id', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/${userId}`)
        .reply(200, fetchUserResponse)
        .patch(
          `/api/content/${config.appName}/users/${userId}`,
          matches({
            email: { iv: fetchUserResponse.data.email.iv },
            orcidLastModifiedDate: {
              iv: `${orcidFixtures.orcidWorksResponse['last-modified-date'].value}`,
            },
            orcidWorks: { iv: orcidFixtures.orcidWorksDeserialisedExpectation },
          }),
        )
        .reply(200, fetchUserResponse);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await usersMockGraphqlClient.syncOrcidProfile(userId);
      expect(result).toBeDefined(); // we only care that the update is made
    });

    test('Should successfully fetch and update user - with user', async () => {
      nock(config.baseUrl)
        .patch(
          `/api/content/${config.appName}/users/${userId}`,
          matches({
            email: { iv: fetchUserResponse.data.email.iv },
            orcidLastModifiedDate: {
              iv: `${orcidFixtures.orcidWorksResponse['last-modified-date'].value}`,
            },
            orcidWorks: { iv: orcidFixtures.orcidWorksDeserialisedExpectation },
          }),
        )
        .reply(200, fetchUserResponse);

      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, orcidFixtures.orcidWorksResponse);

      const result = await usersMockGraphqlClient.syncOrcidProfile(
        userId,
        fetchUserResponse,
      );
      expect(result).toBeDefined(); // we only care that the update is made
    });
  });
});
