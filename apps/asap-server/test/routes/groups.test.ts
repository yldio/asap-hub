import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { GroupController, FetchOptions } from '../../src/controllers/groups';
import * as fixtures from '../handlers/groups/fetch.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';

describe('/groups/ route', () => {
  const groupsControllerMock: jest.Mocked<GroupController> = {
    fetch: jest.fn(),
  };

  const app = appFactory({
    groupController: groupsControllerMock,
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    groupsControllerMock.fetch.mockReset();
  });

  describe('GET /groups', () => {
    test('Should return 200 when no grups exist', async () => {
      groupsControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/groups/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      groupsControllerMock.fetch.mockResolvedValueOnce(fixtures.expectation);

      const response = await supertest(app).get('/groups/');

      expect(response.body).toEqual(fixtures.expectation);
    });

    test('Should call the control with the right parameters', async () => {
      groupsControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      await supertest(app).get('/groups/').query({
        take: 15,
        skip: 5,
        search: 'something',
      });

      const expectedParams: FetchOptions = {
        take: 15,
        skip: 5,
        search: 'something',
      };

      expect(groupsControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get('/groups/').query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });
});
