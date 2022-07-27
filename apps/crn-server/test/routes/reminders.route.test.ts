import { userMock } from "@asap-hub/fixtures";
import { AuthHandler } from "@asap-hub/server-common";
import supertest from "supertest";
import { appFactory } from "../../src/app";

describe('/reminders/ route', () => {
  const getLoggedUser = jest.fn().mockReturnValue(userMock);
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = getLoggedUser();
    next();
  };
  const app = appFactory({
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /reminders', () => {
    test('Should return 200 when no reminders exist', async () => {

      const response = await supertest(app).get('/reminders');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });
  });


});
