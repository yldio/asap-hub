import { NotFoundError } from '@asap-hub/errors';
import supertest from 'supertest';
import { publicAppFactory } from '../../../src/publicApp';
import {
  getListPublicUserResponse,
  getPublicUserResponse,
  getUserResponse,
} from '../../fixtures/users.fixtures';
import { userControllerMock } from '../../mocks/user.controller.mock';

describe('/users/ route', () => {
  const publicApp = publicAppFactory({
    userController: userControllerMock,
  });

  afterEach(jest.clearAllMocks);

  describe('GET /users', () => {
    test('Should return 200 when no user exists', async () => {
      userControllerMock.fetchPublicUsers.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(publicApp).get('/public/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listPublicUserResponse = getListPublicUserResponse();

      userControllerMock.fetchPublicUsers.mockResolvedValueOnce(
        listPublicUserResponse,
      );

      const response = await supertest(publicApp).get('/public/users');

      expect(response.body).toEqual(listPublicUserResponse);
    });

    describe('Parameter validation', () => {
      beforeEach(() => {
        userControllerMock.fetchPublicUsers.mockResolvedValueOnce({
          items: [],
          total: 0,
        });
      });

      test('Should call the controller with the right parameters', async () => {
        await supertest(publicApp).get('/public/users').query({
          take: 15,
          skip: 5,
        });

        const expectedParams = {
          take: 15,
          skip: 5,
        };

        expect(userControllerMock.fetchPublicUsers).toHaveBeenCalledWith(
          expectedParams,
        );
      });
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(publicApp).get(`/public/users`).query({
          additionalField: 'some-data',
        });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(publicApp).get(`/public/users`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /users/:userId', () => {
    const userResponse = getUserResponse();
    userResponse.interestGroups = [
      {
        id: 'interest-group-1',
        name: 'Interest Group 1',
        active: true,
      },
    ];
    userResponse.workingGroups = [
      {
        id: 'working-group-1',
        name: 'Active Working Group 1',
        active: true,
        role: 'Chair',
      },
      {
        id: 'working-group-2',
        name: 'Inactive Working Group 2',
        active: false,
        role: 'Chair',
      },
    ];
    userResponse.researchOutputs = ['research-output-id'];

    test('Should return 200 when the user exists', async () => {
      const userId = 'user-id-1';

      const publicUserResponse = getPublicUserResponse();

      userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

      const response = await supertest(publicApp).get(
        `/public/users/${userId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(publicUserResponse);
    });

    test('Should return only active working groups', async () => {
      const userId = 'user-id-1';

      userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

      const response = await supertest(publicApp).get(
        `/public/users/${userId}`,
      );
      const user = response.body;
      expect(user.workingGroups).toEqual([
        expect.objectContaining({
          name: 'Active Working Group 1',
        }),
      ]);
    });

    test('Should return 404 when the user does not exist', async () => {
      userControllerMock.fetchById.mockRejectedValueOnce(
        new NotFoundError(
          undefined,
          `user with id non-existing-user-id not found`,
        ),
      );

      const response = await supertest(publicApp).get(
        `/public/users/non-existing-user-id`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `user with id non-existing-user-id not found`,
      });
    });

    test('Should return 404 when the user is not onboarded', async () => {
      const userId = 'user-id-1';
      const userResponse = getUserResponse();
      userResponse.onboarded = false;

      userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

      const response = await supertest(publicApp).get(
        `/public/users/${userId}`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `user with id ${userId} not found`,
      });
    });
  });
});
