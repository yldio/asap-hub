import { createAuthUser } from '@asap-hub/fixtures';
import { AuthHandler } from '@asap-hub/server-common';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { loggerMock } from '../mocks/logger.mock';

describe('/reminders/ route', () => {
  const getLoggedUser = jest.fn().mockReturnValue(createAuthUser());
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = getLoggedUser();
    next();
  };
  const app = appFactory({
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /reminders', () => {
    test('Should return the empty result', async () => {
      const response = await supertest(app).get('/reminders').query({
        timezone: 'Europe/London',
      });

      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return 403 when the user is not logged in', async () => {
      getLoggedUser.mockReturnValueOnce(undefined);

      const response = await supertest(app).get('/reminders').query({
        timezone: 'Europe/London',
      });

      expect(response.status).toBe(403);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when additional arguments exist', async () => {
        const response = await supertest(app).get('/reminders/').query({
          timezone: 'Europe/London',
          additionalField: 'some-data',
        });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the timezone is missing', async () => {
        const response = await supertest(app).get('/reminders/');

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the timezone is not valid', async () => {
        const response = await supertest(app).get('/reminders/').query({
          timezone: 'Europe/Foo',
        });

        expect(response.status).toBe(400);
      });
    });
  });
});
