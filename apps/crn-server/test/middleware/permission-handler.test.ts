import { User, userMock } from '@asap-hub/auth';
import { AuthHandler } from '@asap-hub/server-common';
import { Router } from 'express';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { permissionHandler } from '../../src/middleware/permission-handler';
import { listGroupsResponse } from '../fixtures/groups.fixtures';
import { pageResponse } from '../fixtures/page.fixtures';
import { getUserResponse } from '../fixtures/users.fixtures';
import { groupControllerMock } from '../mocks/group-controller.mock';
import { pageControllerMock } from '../mocks/page-controller.mock';
import { userControllerMock } from '../mocks/user-controller.mock';

describe('Permission middleware', () => {
  const nonOnboardedUserMock: User = {
    ...userMock,
    onboarded: false,
  };
  const userMockFactory = jest.fn<User | undefined, []>();
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = userMockFactory();
    next();
  };
  const mockRoutes = Router();
  mockRoutes.get(
    '/route-with-permission-middleware',
    permissionHandler,
    async (_req, res) => {
      return res.json('OK');
    },
  );

  const appWithMockedAuth = appFactory({
    groupController: groupControllerMock,
    userController: userControllerMock,
    pageController: pageControllerMock,
    authHandler: authHandlerMock,
    mockRequestHandlers: [mockRoutes],
  });

  // test the generic permission handler
  describe('Permission handler', () => {
    test('Should allow access for onboarded users', async () => {
      userMockFactory.mockReturnValueOnce(userMock);

      const response = await supertest(appWithMockedAuth).get(
        '/route-with-permission-middleware',
      );

      expect(response.status).toBe(200);
    });

    test('Should deny access for non-onboarded users', async () => {
      userMockFactory.mockReturnValueOnce(nonOnboardedUserMock);

      const response = await supertest(appWithMockedAuth).get(
        '/route-with-permission-middleware',
      );

      expect(response.status).toBe(403);
    });

    test('Should deny access for logged-in users', async () => {
      userMockFactory.mockReturnValueOnce(undefined);

      const response = await supertest(appWithMockedAuth).get(
        '/route-with-permission-middleware',
      );

      expect(response.status).toBe(403);
    });
  });

  // test access to specific routes
  describe('Routes', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('Onboarded users', () => {
      beforeEach(() => {
        userMockFactory.mockReturnValueOnce(userMock);
      });

      test('Should allow access to /groups endpoint', async () => {
        groupControllerMock.fetch.mockResolvedValueOnce(listGroupsResponse);

        const response = await supertest(appWithMockedAuth).get('/groups');

        expect(response.status).toBe(200);
      });
    });

    describe('Non-onboarded users', () => {
      beforeEach(() => {
        userMockFactory.mockReturnValueOnce(nonOnboardedUserMock);
      });

      test('Should deny access to /groups endpoint', async () => {
        const response = await supertest(appWithMockedAuth).get('/groups');

        expect(response.status).toBe(403);
      });

      test('Should deny access to /users endpoint', async () => {
        const response = await supertest(appWithMockedAuth).get('/users');

        expect(response.status).toBe(403);
      });

      test('Should allow access to public /pages endpoint', async () => {
        pageControllerMock.fetchByPath.mockResolvedValueOnce(pageResponse);

        const response = await supertest(appWithMockedAuth).get(
          '/pages/some-other-page',
        );

        expect(response.status).toBe(200);
      });

      describe('User profile', () => {
        test('Should allow access to GET /users/{user_id} when the requested user is the logged-in user', async () => {
          userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());

          const response = await supertest(appWithMockedAuth).get(
            `/users/${userMock.id}`,
          );
          expect(response.status).toBe(200);
        });

        test('Should deny access to GET /users/{user_id} when the requested user is not the logged-in user', async () => {
          const response = await supertest(appWithMockedAuth).get(
            `/users/some-other-id`,
          );

          expect(response.status).toBe(403);
        });

        test('Should allow access to PATCH /users/{user_id}', async () => {
          userControllerMock.update.mockResolvedValueOnce(getUserResponse());

          const response = await supertest(appWithMockedAuth)
            .patch(`/users/${userMock.id}`)
            .send({ jobTitle: 'CEO' });

          expect(response.status).toBe(200);
        });
      });
    });
  });
});
