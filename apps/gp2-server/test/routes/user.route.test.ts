import { FetchOptions, gp2 } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { fetchExpectation, getUserResponse } from '../fixtures/user.fixtures';
import { loggerMock } from '../mocks/logger.mock';
import { userControllerMock } from '../mocks/user-controller.mock';

describe('/users/ route', () => {
  afterEach(jest.resetAllMocks);

  describe('GET /users', () => {
    test('Should return 200 when no users exist', async () => {
      const { app } = getApp();
      userControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const { app } = getApp();
      userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

      const response = await supertest(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fetchExpectation);
    });

    test('Should call the controller method with the correct parameters', async () => {
      const { app } = getApp();
      userControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      await supertest(app).get('/users').query({
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
        const { app } = getApp();
        const response = await supertest(app).get('/users').query({
          additionalField: 'some-data',
        });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const { app } = getApp();
        const response = await supertest(app).get('/users').query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });

      test('Should return the results correctly when a filter is used', async () => {
        userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

        const { app } = getApp();
        const response = await supertest(app)
          .get('/users')
          .query({
            filter: { region: ['Europe'] },
          });

        expect(response.status).toBe(200);
      });

      test('Should return the results correctly when multiple filters are used', async () => {
        userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

        const { app } = getApp();
        const response = await supertest(app)
          .get('/users')
          .query({
            filter: { region: ['Europe', 'Asia'] },
          });

        expect(response.status).toBe(200);
      });
    });
  });

  describe('GET /users/{user_id}', () => {
    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const { app } = getApp();
      const response = await supertest(app).get('/users/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());

      const { app } = getApp();
      const response = await supertest(app).get('/users/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getUserResponse());
    });

    test('Should call the controller with the right parameter', async () => {
      const userId = 'abc123';

      const { app, loggedInUserId } = getApp();
      await supertest(app).get(`/users/${userId}`);

      expect(userControllerMock.fetchById).toBeCalledWith(
        userId,
        loggedInUserId,
      );
    });
  });

  describe('GET /users/invites/{code}', () => {
    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.fetchByCode.mockRejectedValueOnce(Boom.forbidden());

      const { app } = getApp();
      const response = await supertest(app).get('/users/invites/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetchByCode.mockResolvedValueOnce(getUserResponse());

      const { app } = getApp();
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

      const { app } = getApp();
      await supertest(app).get(`/users/invites/${code}`);

      expect(userControllerMock.fetchByCode).toBeCalledWith(code);
    });
  });
  const getApp = () => {
    const loggedInUserId = '11';
    const loggedUser: gp2.UserResponse = {
      ...getUserResponse(),
      id: loggedInUserId,
    };
    const getLoggedUser = jest.fn().mockReturnValue(loggedUser);
    const authHandlerMock: AuthHandler = (req, _res, next) => {
      req.loggedInUser = getLoggedUser();
      next();
    };
    const app = appFactory({
      userController: userControllerMock,
      authHandler: authHandlerMock,
      logger: loggerMock,
    });
    return { app, loggedInUserId };
  };
});
