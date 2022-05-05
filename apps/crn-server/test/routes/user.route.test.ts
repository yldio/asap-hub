import supertest from 'supertest';
import Boom from '@hapi/boom';
import Crypto from 'crypto';
import { UserResponse } from '@asap-hub/model';
import { userMock } from '@asap-hub/fixtures';
import { AuthHandler } from '@asap-hub/server-common';
import { appFactory } from '../../src/app';
import { FetchOptions } from '../../src/utils/types';
import {
  fetchExpectation,
  updateAvatarBody,
  userPatchRequest,
  getUserResponse,
} from '../fixtures/users.fixtures';
import { groupControllerMock } from '../mocks/group-controller.mock';
import { userControllerMock } from '../mocks/user-controller.mock';
import { listGroupsResponse } from '../fixtures/groups.fixtures';

describe('/users/ route', () => {
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = {
      ...userMock,
      teams: [
        {
          id: 'team-id-1',
          role: 'Project Manager',
        },
        {
          id: 'team-id-2',
          role: 'Project Manager',
        },
      ],
    };
    next();
  };
  const appWithMockedAuth = appFactory({
    groupController: groupControllerMock,
    userController: userControllerMock,
    authHandler: authHandlerMock,
  });

  const app = appFactory({
    groupController: groupControllerMock,
    userController: userControllerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /users', () => {
    test('Should return 200 when no users exist', async () => {
      userControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(appWithMockedAuth).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

      const response = await supertest(appWithMockedAuth).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fetchExpectation);
    });

    test('Should call the controller method with the correct parameters', async () => {
      userControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      await supertest(appWithMockedAuth).get('/users').query({
        take: 15,
        skip: 5,
        search: 'something',
      });

      const expectedParams: FetchOptions = {
        take: 15,
        skip: 5,
        search: 'something',
      };

      expect(userControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a 400 error when additional properties exist', async () => {
        const response = await supertest(appWithMockedAuth)
          .get('/users')
          .query({
            additionalField: 'some-data',
          });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(appWithMockedAuth)
          .get('/users')
          .query({
            take: 'invalid param',
          });

        expect(response.status).toBe(400);
      });

      test('Should return the results correctly when a filter is used', async () => {
        userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

        const response = await supertest(appWithMockedAuth).get(
          '/users?filter=Project+Manager',
        );

        expect(response.status).toBe(200);
      });

      test('Should return the results correctly when multiple filters are used', async () => {
        userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

        const response = await supertest(appWithMockedAuth).get(
          '/users?filter=Project+Manager&filter=Lead+PI',
        );

        expect(response.status).toBe(200);
      });
    });
  });

  describe('GET /users/{user_id}', () => {
    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(appWithMockedAuth).get('/users/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());

      const response = await supertest(appWithMockedAuth).get('/users/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getUserResponse());
    });

    test('Should call the controller with the right parameter', async () => {
      const userId = 'abc123';

      await supertest(appWithMockedAuth).get(`/users/${userId}`);

      expect(userControllerMock.fetchById).toBeCalledWith(userId);
    });

    test('Should return 404 when the user is found but is not onboarded', async () => {
      const userNonOnboardedResponse = {
        ...getUserResponse(),
        onboarded: false,
      };
      userControllerMock.fetchById.mockResolvedValueOnce(
        userNonOnboardedResponse,
      );

      const response = await supertest(appWithMockedAuth).get('/users/123');

      expect(response.status).toBe(404);
    });

    test('Should return the result when the user is found and is not onboarded but is queried by the same, logged-in user', async () => {
      const userNonOnboardedResponse = {
        ...getUserResponse(),
        onboarded: false,
        id: userMock.id,
      };
      userControllerMock.fetchById.mockResolvedValueOnce(
        userNonOnboardedResponse,
      );

      const response = await supertest(appWithMockedAuth).get('/users/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(userNonOnboardedResponse);
    });
  });

  describe('GET /users/invites/{code}', () => {
    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.fetchByCode.mockRejectedValueOnce(Boom.forbidden());

      const response = await supertest(app).get('/users/invites/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetchByCode.mockResolvedValueOnce(getUserResponse());

      const response = await supertest(app).get('/users/invites/123');

      expect(response.status).toBe(200);
      const expectedResult = {
        id: getUserResponse().id,
        displayName: getUserResponse().displayName,
      };
      expect(response.body).toEqual(expectedResult);
    });

    test('Should call the controller with the right parameter', async () => {
      const code = 'abc123';

      await supertest(app).get(`/users/invites/${code}`);

      expect(userControllerMock.fetchByCode).toBeCalledWith(code);
    });
  });

  describe('GET /users/{user_id}/groups', () => {
    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(appWithMockedAuth).get(
        '/users/not-found/groups',
      );

      expect(response.status).toBe(404);
    });

    test('Should return 200 when no grups exist', async () => {
      userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());
      groupControllerMock.fetchByUserId.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(appWithMockedAuth).get(
        '/users/123/groups',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());
      groupControllerMock.fetchByUserId.mockResolvedValueOnce(
        listGroupsResponse,
      );

      const response = await supertest(appWithMockedAuth).get(
        '/users/123/groups',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(listGroupsResponse);
    });

    test('Should call the controller method with the correct parameters', async () => {
      const userResponse = getUserResponse();
      userResponse.teams = [
        {
          id: 'team-id-1',
          role: 'Lead PI (Core Leadership)',
          displayName: 'Team A',
        },
        {
          id: 'team-id-3',
          role: 'Lead PI (Core Leadership)',
          displayName: 'Team B',
        },
      ];
      userControllerMock.fetchById.mockResolvedValueOnce(userResponse);
      groupControllerMock.fetchByUserId.mockResolvedValueOnce({
        items: [],
        total: 0,
      });
      const teams = [userResponse.teams[0]!.id, userResponse.teams[1]!.id];
      const userId = userResponse.id;

      await supertest(appWithMockedAuth).get(`/users/${userId}/groups`).query({
        take: 15,
        skip: 5,
        search: 'something',
      });

      const expectedParams: FetchOptions = {
        take: 15,
        skip: 5,
        search: 'something',
      };

      expect(groupControllerMock.fetchByUserId).toBeCalledWith(
        userId,
        teams,
        expectedParams,
      );
    });

    describe('Parameter validation', () => {
      test('Should return a 400 error when additional properties exist', async () => {
        const response = await supertest(appWithMockedAuth)
          .get('/users/123/groups')
          .query({
            additionalField: 'some-data',
          });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(appWithMockedAuth)
          .get('/users/123/groups')
          .query({
            take: 'invalid param',
          });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('PATCH /users/{user_id}', () => {
    const userId = userMock.id;

    test('Should return the results correctly', async () => {
      userControllerMock.update.mockResolvedValueOnce(getUserResponse());

      const response = await supertest(appWithMockedAuth)
        .patch(`/users/${userId}`)
        .send({ jobTitle: 'CEO' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getUserResponse());
    });

    test('Should return 500 when it fails to update the user', async () => {
      userControllerMock.update.mockRejectedValueOnce(
        Boom.badImplementation('squidex', {
          data: 'Squidex Error Message',
        }),
      );

      const response = await supertest(appWithMockedAuth)
        .patch(`/users/${userId}`)
        .send({ jobTitle: 'CEO' });

      expect(response.status).toBe(500);
    });

    test('Returns 403 when user is changing other user', async () => {
      const response = await supertest(appWithMockedAuth)
        .patch('/users/not-me')
        .send({ jobTitle: 'CEO' });
      expect(response.status).toBe(403);
    });

    test('Returns 403 when user is editing a team he doesnt belong to', async () => {
      const response = await supertest(appWithMockedAuth)
        .patch(`/users/${userId}`)
        .send({
          teams: [
            {
              id: 'team-id-1000',
            },
          ],
        });
      expect(response.status).toBe(403);
    });

    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.update.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(appWithMockedAuth)
        .patch(`/users/${userId}`)
        .send({ jobTitle: 'CEO' });
      expect(response.status).toBe(404);
    });

    test('Should call the controller method with the correct parameters and remove ignored nulls and undefined parameters', async () => {
      userControllerMock.update.mockResolvedValueOnce(getUserResponse());

      const requestParams = {
        ...userPatchRequest,
        firstName: undefined, // should be ignored
        contactEmail: null, // should be ignored
      };
      await supertest(appWithMockedAuth)
        .patch(`/users/${userId}`)
        .send(requestParams);

      const { onboarded, ...remainingParams } = userPatchRequest;

      expect(userControllerMock.update).toBeCalledWith(userId, remainingParams);
      expect(userControllerMock.update).toBeCalledWith(userId, { onboarded });
    });

    test('Should not call the controller method if parameters are not allowed (orcid)', async () => {
      const resValidOrcid = await supertest(appWithMockedAuth)
        .patch(`/users/${userId}`)
        .send({ orcid: '0000-0000-0000', jobTitle: 'Professor' });

      const resInvalidOrcid = await supertest(appWithMockedAuth)
        .patch(`/users/${userId}`)
        .send({ orcid: '123-456-789', jobTitle: 'Professor' });

      expect(resValidOrcid.status).toBe(400);
      expect(resInvalidOrcid.status).toBe(400);
      expect(userControllerMock.update).not.toHaveBeenCalled();
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(appWithMockedAuth)
          .patch(`/users/${userId}`)
          .send({ jobTitle: 666 });

        expect(response.status).toBe(400);
      });

      test.each([
        'contactEmail',
        'firstName',
        'lastName',
        'jobTitle',
        'degree',
        'institution',
        'biography',
        'country',
        'city',
        'expertiseAndResourceDescription',
        'researchInterests',
        'responsibilities',
        'reachOut',
      ])(
        'Should be able to provide an empty string for the %s parameter ',
        async (parameter) => {
          const response = await supertest(appWithMockedAuth)
            .patch(`/users/${userId}`)
            .send({ [parameter]: '' });

          expect(response.status).toBe(200);
        },
      );

      test.each([
        'contactEmail',
        'firstName',
        'lastName',
        'jobTitle',
        'degree',
        'institution',
        'biography',
        'country',
        'city',
        'expertiseAndResourceDescription',
        'researchInterests',
        'responsibilities',
        'reachOut',
      ])(
        'Should be able to provide null for the %s parameter ',
        async (parameter) => {
          const response = await supertest(appWithMockedAuth)
            .patch(`/users/${userId}`)
            .send({ [parameter]: null });

          expect(response.status).toBe(200);
        },
      );

      test.each([
        'contactEmail',
        'firstName',
        'lastName',
        'jobTitle',
        'institution',
        'biography',
        'country',
        'city',
        'expertiseAndResourceDescription',
        'researchInterests',
        'responsibilities',
        'reachOut',
      ])(
        'Should be able to provide a random string for the %s parameter ',
        async (parameter) => {
          const response = await supertest(appWithMockedAuth)
            .patch(`/users/${userId}`)
            .send({ [parameter]: 'some random string' });

          expect(response.status).toBe(200);
        },
      );

      test.each(['expertiseAndResourceTags', 'questions'])(
        'Should be able to provide an array of strings for the %s parameter ',
        async (parameter) => {
          const response = await supertest(appWithMockedAuth)
            .patch(`/users/${userId}`)
            .send({ [parameter]: ['some random', 'string'] });

          expect(response.status).toBe(200);
        },
      );

      test.each(['expertiseAndResourceTags', 'questions'])(
        'Should not accept a string for the %s parameter ',
        async (parameter) => {
          const response = await supertest(appWithMockedAuth)
            .patch(`/users/${userId}`)
            .send({ [parameter]: 'random string' });

          expect(response.status).toBe(400);
        },
      );

      test('Should be able to provide a list of objects containing IDs for the teams parameter ', async () => {
        const response = await supertest(appWithMockedAuth)
          .patch(`/users/${userId}`)
          .send({ teams: [{ id: 'team-id-1' }, { id: 'team-id-2' }] });

        expect(response.status).toBe(200);
      });

      test('Should not accept a list of arbitrary objects for the teams parameter ', async () => {
        const response = await supertest(appWithMockedAuth)
          .patch(`/users/${userId}`)
          .send({
            teams: [
              { something: 'something' },
              { anything: 'anything at all' },
            ],
          });

        expect(response.status).toBe(400);
      });

      test('Should be able to provide the right object for the social parameter ', async () => {
        const response = await supertest(appWithMockedAuth)
          .patch(`/users/${userId}`)
          .send({
            social: {
              website1: 'some string',
              website2: 'some string',
              linkedIn: 'some string',
              researcherId: 'some string',
              twitter: 'some string',
              github: 'some string',
              googleScholar: 'some string',
              researchGate: 'some string',
            },
          });

        expect(response.status).toBe(200);
      });

      test('Should be able to provide a string of 250 characters for the reachOut', async () => {
        const response = await supertest(appWithMockedAuth)
          .patch(`/users/${userId}`)
          .send({
            reachOut: 'x'.repeat(250),
          });

        expect(response.status).toBe(200);
      });

      test('Should not accept a string of over 250 characters for the reachOut', async () => {
        const response = await supertest(appWithMockedAuth)
          .patch(`/users/${userId}`)
          .send({
            reachOut: 'x'.repeat(251),
          });

        expect(response.status).toBe(400);
      });

      describe('degree', () => {
        test.each([
          'BA',
          'BSc',
          'MD',
          'MSc',
          'MD, PhD',
          'PhD',
          'MPH',
          'MA',
          'MBA',
        ])('Should accept the %s degree', async (degree) => {
          const response = await supertest(appWithMockedAuth)
            .patch(`/users/${userId}`)
            .send({ degree });

          expect(response.status).toBe(200);
        });

        test('Should not accept any random degree', async () => {
          const response = await supertest(appWithMockedAuth)
            .patch(`/users/${userId}`)
            .send({ degree: 'blah' });

          expect(response.status).toBe(400);
        });
      });
    });

    describe('Profile completeness validation', () => {
      test('Should return an error when attempting to onboard the user with incomplete profile (missing questions)', async () => {
        const incompleteUserResponse: UserResponse = {
          ...getUserResponse(),
          questions: [],
        };
        userControllerMock.update.mockResolvedValueOnce(incompleteUserResponse);

        const response = await supertest(appWithMockedAuth)
          .patch(`/users/${userId}`)
          .send({ onboarded: true });

        expect(response.status).toBe(422);
        expect(response.body).toMatchObject({
          message: 'User profile is not complete',
        });
      });

      test('Should not return an error when updating a user with incomplete profile while sending onboarded flag set to false', async () => {
        const incompleteUserResponse: UserResponse = {
          ...getUserResponse(),
          onboarded: false,
          questions: [],
        };
        userControllerMock.update.mockResolvedValueOnce(incompleteUserResponse);

        const response = await supertest(appWithMockedAuth)
          .patch(`/users/${userId}`)
          .send({ onboarded: false });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(incompleteUserResponse);
      });

      test('Should update and onboard the user', async () => {
        const nonOnboardedUserResponse: UserResponse = {
          ...getUserResponse(),
          onboarded: false,
        };
        userControllerMock.update.mockResolvedValueOnce(
          nonOnboardedUserResponse,
        );

        const onboardedUserResponse: UserResponse = {
          ...getUserResponse(),
          onboarded: true,
        };
        userControllerMock.update.mockResolvedValueOnce(onboardedUserResponse);

        const response = await supertest(appWithMockedAuth)
          .patch(`/users/${userId}`)
          .send({ onboarded: true, questions: ['question 1', 'question 2'] });

        expect(response.body).toEqual(onboardedUserResponse);
      });
    });
  });

  describe('POST /users/{user_id}/avatar', () => {
    const userId = userMock.id;

    test('Should return the results correctly', async () => {
      userControllerMock.updateAvatar.mockResolvedValueOnce(getUserResponse());

      const response = await supertest(appWithMockedAuth)
        .post(`/users/${userId}/avatar`)
        .send(updateAvatarBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getUserResponse());
    });

    test('Should upload pictures of 2MB correctly', async () => {
      userControllerMock.updateAvatar.mockResolvedValueOnce(getUserResponse());
      const blob = Crypto.randomBytes(2097152).toString('base64');
      const updateLargeAvatar = {
        avatar: `data:image/jpeg;base64,${blob}`,
      };

      const response = await supertest(appWithMockedAuth)
        .post(`/users/${userId}/avatar`)
        .send(updateLargeAvatar);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getUserResponse());
    });

    test('Should return 500 when it fails to update the avatar', async () => {
      userControllerMock.updateAvatar.mockRejectedValueOnce(
        Boom.badImplementation('squidex', {
          data: 'Squidex Error Message',
        }),
      );

      const response = await supertest(appWithMockedAuth)
        .post(`/users/${userId}/avatar`)
        .send(updateAvatarBody);

      expect(response.status).toBe(500);
    });

    test('Returns 403 when user is changing other user', async () => {
      const response = await supertest(appWithMockedAuth)
        .post('/users/not-me/avatar')
        .send(updateAvatarBody);
      expect(response.status).toBe(403);
    });

    test('Should call the controller method with the correct parameters', async () => {
      await supertest(appWithMockedAuth)
        .post(`/users/${userId}/avatar`)
        .send(updateAvatarBody);

      expect(userControllerMock.updateAvatar).toBeCalledWith(
        userId,
        expect.any(Buffer),
        'image/jpeg',
      );
    });

    describe('Parameter validation', () => {
      test('Returns 400 when payload is invalid', async () => {
        const response = await supertest(appWithMockedAuth).post(
          `/users/${userId}/avatar`,
        );
        expect(response.status).toBe(400);
      });

      test('Returns 400 when payload is not data URL conformant', async () => {
        const response = await supertest(appWithMockedAuth)
          .post(`/users/${userId}/avatar`)
          .send({ avatar: 'data:video/mp4' });
        expect(response.status).toBe(400);
      });

      test('Returns 415 when content type is invalid', async () => {
        const response = await supertest(appWithMockedAuth)
          .post(`/users/${userId}/avatar`)
          .send({ avatar: 'data:video/mp4;base64,some-data' });
        expect(response.status).toBe(415);
      });

      test('Returns 413 when avatar is too big', async () => {
        const response = await supertest(appWithMockedAuth)
          .post(`/users/${userId}/avatar`)
          .send({
            avatar: `data:image/jpeg;base64,${Buffer.alloc(4e6).toString(
              'base64',
            )}`,
          });
        expect(response.status).toBe(413);
      });
    });
  });
});
