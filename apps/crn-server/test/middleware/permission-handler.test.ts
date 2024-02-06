import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { AuthHandler, permissionHandler } from '@asap-hub/server-common';
import { Router } from 'express';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { listInterestGroupsResponse } from '../fixtures/interest-groups.fixtures';
import { pageResponse } from '../fixtures/page.fixtures';
import { getUserResponse } from '../fixtures/users.fixtures';
import { interestGroupControllerMock } from '../mocks/interest-group.controller.mock';
import { loggerMock } from '../mocks/logger.mock';
import { pageControllerMock } from '../mocks/page.controller.mock';
import { researchTagControllerMock } from '../mocks/research-tag.controller.mock';
import { userControllerMock } from '../mocks/user.controller.mock';

describe('Permission middleware', () => {
  const mockUser = createUserResponse();
  const nonOnboardedUserMock: UserResponse = {
    ...mockUser,
    onboarded: false,
  };
  const userMockFactory = jest.fn<UserResponse | undefined, []>();
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
    interestGroupController: interestGroupControllerMock,
    userController: userControllerMock,
    pageController: pageControllerMock,
    researchTagController: researchTagControllerMock,
    authHandler: authHandlerMock,
    mockRequestHandlers: [mockRoutes],
    logger: loggerMock,
  });

  // test the generic permission handler
  describe('Permission handler', () => {
    test('Should allow access for onboarded users', async () => {
      userMockFactory.mockReturnValueOnce(mockUser);

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
        userMockFactory.mockReturnValueOnce(mockUser);
      });

      test('Should allow access to /interest-groups endpoint', async () => {
        interestGroupControllerMock.fetch.mockResolvedValueOnce(
          listInterestGroupsResponse,
        );

        const response =
          await supertest(appWithMockedAuth).get('/interest-groups');

        expect(response.status).toBe(200);
      });
    });

    describe('Non-onboarded users', () => {
      beforeEach(() => {
        userMockFactory.mockReturnValueOnce(nonOnboardedUserMock);
      });

      test('Should deny access to /interest-groups endpoint', async () => {
        const response =
          await supertest(appWithMockedAuth).get('/interest-groups');

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

      test('Should allow access to public /research-tags endpoint', async () => {
        researchTagControllerMock.fetchAll.mockResolvedValueOnce({
          total: 0,
          items: [],
        });

        const response =
          await supertest(appWithMockedAuth).get('/research-tags');

        expect(response.status).toBe(200);
      });

      describe('User profile', () => {
        test('Should allow access to GET /users/{user_id} when the requested user is the logged-in user', async () => {
          userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());

          const response = await supertest(appWithMockedAuth).get(
            `/users/${mockUser.id}`,
          );
          expect(response.status).toBe(200);
        });

        test('Should deny access to GET /users/{user_id} when the requested user is not the logged-in user', async () => {
          const response =
            await supertest(appWithMockedAuth).get(`/users/some-other-id`);

          expect(response.status).toBe(403);
        });

        test('Should allow access to PATCH /users/{user_id}', async () => {
          userControllerMock.update.mockResolvedValueOnce(getUserResponse());

          const response = await supertest(appWithMockedAuth)
            .patch(`/users/${mockUser.id}`)
            .send({ jobTitle: 'CEO' });

          expect(response.status).toBe(200);
        });
      });
    });
  });
});
