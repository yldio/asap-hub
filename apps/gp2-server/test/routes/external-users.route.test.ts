import { gp2 } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getFetchExternalUsersResponse } from '../fixtures/external-users.fixtures';
import { getUserResponse } from '../fixtures/user.fixtures';
import { ExternalUsersControllerMock } from '../mocks/external-users.controller.mock';
import { loggerMock } from '../mocks/logger.mock';

describe('/external-users route', () => {
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
    externalUsersController: ExternalUsersControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(() => {
    getLoggedUser.mockReturnValue(loggedUser);
  });

  afterEach(jest.resetAllMocks);

  describe('GET /external-users', () => {
    test('Should return 200 when no users exist', async () => {
      ExternalUsersControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/external-users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      ExternalUsersControllerMock.fetch.mockResolvedValueOnce(
        getFetchExternalUsersResponse(),
      );

      const response = await supertest(app).get('/external-users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getFetchExternalUsersResponse());
    });

    test('Should call the controller method with the correct parameters', async () => {
      ExternalUsersControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const params: gp2.FetchExternalUsersOptions = {
        take: 15,
        skip: 5,
        search: 'something',
      };
      await supertest(app).get('/external-users').query(params);

      const expectedParams: gp2.FetchExternalUsersOptions = {
        take: 15,
        skip: 5,
        search: 'something',
      };

      expect(ExternalUsersControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a 400 error when additional properties exist', async () => {
        const response = await supertest(app).get('/external-users').query({
          additionalField: 'some-data',
        });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get('/external-users').query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });
});
