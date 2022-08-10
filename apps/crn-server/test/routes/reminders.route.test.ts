import { userMock } from '@asap-hub/fixtures';
import { AuthHandler } from '@asap-hub/server-common';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getListReminderResponse } from '../fixtures/reminders.fixtures';
import { reminderControllerMock } from '../mocks/reminder-controller.mock';

describe('/reminders/ route', () => {
  const getLoggedUser = jest.fn().mockReturnValue(userMock);
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = getLoggedUser();
    next();
  };
  const app = appFactory({
    authHandler: authHandlerMock,
    reminderController: reminderControllerMock,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /reminders', () => {
    test('Should return 200 when no reminders exist', async () => {
      reminderControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/reminders');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should call the controller with the logged-in user ID', async () => {
      const userId = 'some-user-id';
      const someUser = {
        ...userMock,
        id: userId,
      };
      getLoggedUser.mockReturnValueOnce(someUser);
      await supertest(app).get('/reminders');

      expect(reminderControllerMock.fetch).toBeCalledWith({ userId });
    });

    test('Should return the results correctly', async () => {
      reminderControllerMock.fetch.mockResolvedValueOnce(
        getListReminderResponse(),
      );

      const response = await supertest(app).get('/reminders');

      expect(response.body).toEqual(getListReminderResponse());
    });

    test('Should return 403 when the user is not logged in', async () => {
      getLoggedUser.mockReturnValueOnce(undefined);

      const response = await supertest(app).get('/reminders');

      expect(response.status).toBe(403);
    });
  });
});
