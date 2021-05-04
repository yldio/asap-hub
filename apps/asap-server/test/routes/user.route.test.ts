import supertest from 'supertest';
import Boom from '@hapi/boom';
import { UserPatchRequest } from '@asap-hub/model';

import { appFactory } from '../../src/app';
import { FetchOptions } from '../../src/utils/types';
import * as groupFixtures from '../fixtures/groups.fixtures';
import * as fixtures from '../fixtures/users.fixtures';
import { groupControllerMock } from '../mocks/group-controller.mock';
import { userControllerMock } from '../mocks/user-controller.mock';
import { AuthHandler } from '../../src/middleware/auth-handler';
import { userMock } from '../../src/utils/__mocks__/validate-token';

describe('/users/ route', () => {
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedUser = {
      ...userMock,
      teams: [
        {
          id: 'some-id-1',
          role: 'Project Manager',
        },
        {
          id: 'some-id-2',
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
      userControllerMock.fetch.mockResolvedValueOnce(fixtures.fetchExpectation);

      const response = await supertest(appWithMockedAuth).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fixtures.fetchExpectation);
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
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(appWithMockedAuth)
          .get('/users')
          .query({
            take: 'invalid param',
          });

        expect(response.status).toBe(400);
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
      userControllerMock.fetchById.mockResolvedValueOnce(
        fixtures.fetchUserExpectation,
      );

      const response = await supertest(appWithMockedAuth).get('/users/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fixtures.fetchUserExpectation);
    });

    test('Should call the controller with the right parameter', async () => {
      const userId = 'abc123';

      await supertest(appWithMockedAuth).get(`/users/${userId}`);

      expect(userControllerMock.fetchById).toBeCalledWith(userId);
    });
  });

  describe('GET /users/invites/{code}', () => {
    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.fetchByCode.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get('/users/invites/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetchByCode.mockResolvedValueOnce(
        fixtures.fetchUserExpectation,
      );

      const response = await supertest(app).get('/users/invites/123');

      expect(response.status).toBe(200);
      const expectedResult = {
        id: fixtures.fetchUserExpectation.id,
        displayName: fixtures.fetchUserExpectation.displayName,
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
      userControllerMock.fetchById.mockResolvedValueOnce(
        fixtures.fetchUserExpectation,
      );
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
      userControllerMock.fetchById.mockResolvedValueOnce(
        fixtures.fetchUserExpectation,
      );
      groupControllerMock.fetchByUserId.mockResolvedValueOnce(
        groupFixtures.queryGroupsExpectation,
      );

      const response = await supertest(appWithMockedAuth).get(
        '/users/123/groups',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(groupFixtures.queryGroupsExpectation);
    });

    test('Should call the controller method with the correct parameters', async () => {
      userControllerMock.fetchById.mockResolvedValueOnce(
        fixtures.fetchUserExpectation,
      );
      groupControllerMock.fetchByUserId.mockResolvedValueOnce({
        items: [],
        total: 0,
      });
      const teams = ['team-id-1', 'team-id-3'];
      const userId = '123abcd';

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
      userControllerMock.update.mockResolvedValueOnce(
        fixtures.updateUserExpectation,
      );

      const response = await supertest(appWithMockedAuth)
        .patch(`/users/${userId}`)
        .send({ jobTitle: 'CEO' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fixtures.updateUserExpectation);
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
              responsibilities: 'I do stuff',
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

    test('Should call the controller method with the correct parameters', async () => {
      userControllerMock.update.mockResolvedValueOnce(
        fixtures.updateUserExpectation,
      );

      await supertest(appWithMockedAuth)
        .patch(`/users/${userId}`)
        .send({
          social: { github: 'johnytiago' },
          jobTitle: 'CEO',
          questions: ['To be or not to be?'],
          firstName: undefined, // should be ignored
        });

      const expectedParams: UserPatchRequest = {
        social: { github: 'johnytiago' },
        jobTitle: 'CEO',
        questions: ['To be or not to be?'],
      };

      expect(userControllerMock.update).toBeCalledWith(userId, expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(appWithMockedAuth)
          .patch(`/users/${userId}`)
          .send({ jobTitle: 666 });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('POST /users/{user_id}/avatar', () => {
    const userId = userMock.id;

    test('Should return the results correctly', async () => {
      userControllerMock.updateAvatar.mockResolvedValueOnce(
        fixtures.updateUserExpectation,
      );

      const response = await supertest(appWithMockedAuth)
        .post(`/users/${userId}/avatar`)
        .send(fixtures.updateAvatarBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fixtures.updateUserExpectation);
    });

    test('Should return 500 when it fails to update the avatar', async () => {
      userControllerMock.updateAvatar.mockRejectedValueOnce(
        Boom.badImplementation('squidex', {
          data: 'Squidex Error Message',
        }),
      );

      const response = await supertest(appWithMockedAuth)
        .post(`/users/${userId}/avatar`)
        .send(fixtures.updateAvatarBody);

      expect(response.status).toBe(500);
    });

    test('Returns 403 when user is changing other user', async () => {
      const response = await supertest(appWithMockedAuth)
        .post('/users/not-me/avatar')
        .send(fixtures.updateAvatarBody);
      expect(response.status).toBe(403);
    });

    test('Should call the controller method with the correct parameters', async () => {
      await supertest(appWithMockedAuth)
        .post(`/users/${userId}/avatar`)
        .send(fixtures.updateAvatarBody);

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
