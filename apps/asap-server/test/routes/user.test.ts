import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { FetchOptions } from '../../src/controllers/groups';
import * as fixtures from '../handlers/groups/fetch.fixtures';
import { groupControllerMock } from '../mocks/group-controller.mock';
import { AuthHandler } from '../../src/middleware/auth-handler';
import { userMock } from '../../src/utils/__mocks__/validate-token';

describe('/user/ route', () => {
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
  const app = appFactory({
    groupController: groupControllerMock,
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    groupControllerMock.fetchByUserId.mockReset();
  });

  describe('GET /user/{user_id}/groups', () => {
    test('Should return 200 when no grups exist', async () => {
      groupControllerMock.fetchByUserId.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/user/123/groups');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      groupControllerMock.fetchByUserId.mockResolvedValueOnce(
        fixtures.expectation,
      );

      const response = await supertest(app).get('/user/123/groups');

      expect(response.body).toEqual(fixtures.expectation);
    });

    test('Should call the controller method with the correct parameters', async () => {
      groupControllerMock.fetchByUserId.mockResolvedValueOnce({
        items: [],
        total: 0,
      });
      const teams = ['some-id-1', 'some-id-2'];
      const userId = '123abcd';

      await supertest(app).get(`/user/${userId}/groups`).query({
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
        const response = await supertest(app).get(`/user/123/groups`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });
});
