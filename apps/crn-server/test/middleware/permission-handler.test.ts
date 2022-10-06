import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import { Router } from 'express';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { permissionHandler } from '../../src/middleware/permission-handler';
import { listGroupsResponse } from '../fixtures/groups.fixtures';
import { pageResponse } from '../fixtures/page.fixtures';
import { getUserResponse } from '../fixtures/users.fixtures';
import { calendarControllerMock } from '../mocks/calendar-controller.mock';
import { dashboardControllerMock } from '../mocks/dashboard-controller.mock';
import { discoverControllerMock } from '../mocks/discover-controller.mock';
import { groupControllerMock } from '../mocks/group-controller.mock';
import { newsControllerMock } from '../mocks/news-controller.mock';
import { pageControllerMock } from '../mocks/page-controller.mock';
import { researchOutputControllerMock } from '../mocks/research-outputs-controller.mock';
import { researchTagControllerMock } from '../mocks/research-tags-controller.mock';
import { teamControllerMock } from '../mocks/team-controller.mock';
import { userControllerMock } from '../mocks/user-controller.mock';
import { labControllerMock } from '../mocks/lab-controller.mock';
import { reminderControllerMock } from '../mocks/reminder-controller.mock';

describe('Permission middleware', () => {
  const mockUser = createUserResponse();
  const nonOnboardedUserMock: UserResponse = {
    ...mockUser,
    onboarded: false,
  };
  const alumniUser: UserResponse = {
    ...mockUser,
    alumniSinceDate: '2020-01-01',
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
    groupController: groupControllerMock,
    userController: userControllerMock,
    pageController: pageControllerMock,
    teamController: teamControllerMock,
    researchTagController: researchTagControllerMock,
    researchOutputController: researchOutputControllerMock,
    calendarController: calendarControllerMock,
    dashboardController: dashboardControllerMock,
    discoverController: discoverControllerMock,
    labsController: labControllerMock,
    newsController: newsControllerMock,
    reminderController: reminderControllerMock,
    authHandler: authHandlerMock,
    mockRequestHandlers: [mockRoutes],
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

    test('Should deny access for alumnis', async () => {
      userMockFactory.mockReturnValueOnce(alumniUser);

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
            `/users/${mockUser.id}`,
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
            .patch(`/users/${mockUser.id}`)
            .send({ jobTitle: 'CEO' });

          expect(response.status).toBe(200);
        });
      });
    });

    describe('Alumnis', () => {
      beforeEach(() => {
        userMockFactory.mockReturnValueOnce(alumniUser);
      });

      test.each`
        endpoint                   | access
        ${'calendars'}             | ${'deny'}
        ${'dashboard'}             | ${'deny'}
        ${'discover'}              | ${'deny'}
        ${'groups'}                | ${'deny'}
        ${'labs'}                  | ${'deny'}
        ${'news'}                  | ${'deny'}
        ${'pages/some-other-page'} | ${'allow'}
        ${'reminders'}             | ${'deny'}
        ${'reminders'}             | ${'deny'}
        ${'research-outputs'}      | ${'deny'}
        ${'research-tags'}         | ${'deny'}
        ${'teams'}                 | ${'deny'}
        ${'users'}                 | ${'deny'}
      `(
        'Should $access access to /$endpoint endpoint',
        async ({ endpoint, access }) => {
          const response = await supertest(appWithMockedAuth).get(
            `/${endpoint}`,
          );

          expect(response.status).toBe(access === 'allow' ? 200 : 403);
        },
      );
    });
  });
});
