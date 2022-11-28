import { FetchOptions, gp2 } from '@asap-hub/model';
import { userDegrees, userRegions } from '@asap-hub/model/src/gp2';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import {
  fetchExpectation,
  getUserResponse,
  userPatchRequest,
} from '../fixtures/user.fixtures';
import { loggerMock } from '../mocks/logger.mock';
import { userControllerMock } from '../mocks/user-controller.mock';

describe('/users/ route', () => {
  afterEach(jest.resetAllMocks);

  describe('GET /users', () => {
    test('Should return 200 when no users exist', async () => {
      const { app } = getApp();
      userControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const { app } = getApp();
      userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

      const response = await supertest(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fetchExpectation);
    });

    test('Should call the controller method with the correct parameters', async () => {
      const { app } = getApp();
      userControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      await supertest(app).get('/users').query({
        take: 15,
        skip: 5,
        search: 'something',
      });

      const expectedParams: FetchOptions = {
        take: 15,
        skip: 5,
        search: 'something',
      };

      expect(userControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a 400 error when additional properties exist', async () => {
        const { app } = getApp();
        const response = await supertest(app).get('/users').query({
          additionalField: 'some-data',
        });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const { app } = getApp();
        const response = await supertest(app).get('/users').query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });

      test('Should return the results correctly when a filter is used', async () => {
        userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

        const { app } = getApp();
        const response = await supertest(app)
          .get('/users')
          .query({
            filter: { region: ['Europe'] },
          });

        expect(response.status).toBe(200);
      });

      test('Should return the results correctly when multiple filters are used', async () => {
        userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

        const { app } = getApp();
        const response = await supertest(app)
          .get('/users')
          .query({
            filter: { region: ['Europe', 'Asia'] },
          });

        expect(response.status).toBe(200);
      });
    });
  });

  describe('GET /users/{user_id}', () => {
    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const { app } = getApp();
      const response = await supertest(app).get('/users/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());

      const { app } = getApp();
      const response = await supertest(app).get('/users/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getUserResponse());
    });

    test('Should call the controller with the right parameter', async () => {
      const userId = 'abc123';

      const { app, loggedInUserId } = getApp();
      await supertest(app).get(`/users/${userId}`);

      expect(userControllerMock.fetchById).toBeCalledWith(
        userId,
        loggedInUserId,
      );
    });
  });

  describe('GET /users/invites/{code}', () => {
    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.fetchByCode.mockRejectedValueOnce(Boom.forbidden());

      const { app } = getApp();
      const response = await supertest(app).get('/users/invites/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetchByCode.mockResolvedValueOnce(getUserResponse());

      const { app } = getApp();
      const response = await supertest(app).get('/users/invites/123');

      expect(response.status).toBe(200);
      const expectedResult = {
        id: getUserResponse().id,
        displayName: getUserResponse().displayName,
      };
      expect(response.body).toEqual(expectedResult);
    });

    test('Should call the controller with the right parameter', async () => {
      const code = 'abc123';

      const { app } = getApp();
      await supertest(app).get(`/users/invites/${code}`);

      expect(userControllerMock.fetchByCode).toBeCalledWith(code);
    });
  });
  describe('PATCH /users/{user_id}', () => {
    test('Should return the results correctly', async () => {
      userControllerMock.update.mockResolvedValueOnce(getUserResponse());

      const { app, loggedInUserId } = getApp();
      const response = await supertest(app)
        .patch(`/users/${loggedInUserId}`)
        .send({ firstName: 'Peter' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getUserResponse());
    });

    test('Should return 500 when it fails to update the user', async () => {
      userControllerMock.update.mockRejectedValueOnce(
        Boom.badImplementation('squidex', {
          data: 'Squidex Error Message',
        }),
      );

      const { app, loggedInUserId } = getApp();
      const response = await supertest(app)
        .patch(`/users/${loggedInUserId}`)
        .send({ firstName: 'Peter' });

      expect(response.status).toBe(500);
    });

    test('Returns 403 when user is changing other user', async () => {
      const { app } = getApp();
      const response = await supertest(app)
        .patch('/users/not-me')
        .send({ firstName: 'Peter' });
      expect(response.status).toBe(403);
    });

    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.update.mockRejectedValueOnce(Boom.notFound());

      const { app, loggedInUserId } = getApp();
      const response = await supertest(app)
        .patch(`/users/${loggedInUserId}`)
        .send({ firstName: 'Peter' });
      expect(response.status).toBe(404);
    });

    test('Should call the controller method with the correct parameters and remove ignored nulls and undefined parameters', async () => {
      userControllerMock.update.mockResolvedValueOnce(getUserResponse());

      const requestParams = {
        ...userPatchRequest,
        firstName: undefined, // should be ignored
        lastName: null, // should be ignored
      };
      const { app, loggedInUserId } = getApp();
      await supertest(app)
        .patch(`/users/${loggedInUserId}`)
        .send(requestParams);
      const { onboarded, ...remainingParams } = userPatchRequest;

      expect(userControllerMock.update).toBeCalledWith(
        loggedInUserId,
        remainingParams,
        loggedInUserId,
      );
      expect(userControllerMock.update).toBeCalledWith(
        loggedInUserId,
        {
          onboarded,
        },
        loggedInUserId,
      );
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const { app, loggedInUserId } = getApp();
        const response = await supertest(app)
          .patch(`/users/${loggedInUserId}`)
          .send({ firstName: 666 });

        expect(response.status).toBe(400);
      });
      describe.each`
        description        | input
        ${'empty string'}  | ${''}
        ${'null'}          | ${null}
        ${'random string'} | ${'random string'}
      `('accepts $description as an input', ({ input }) => {
        test.each([
          'secondaryEmail',
          'firstName',
          'lastName',
          'country',
          'city',
        ])(
          'Should be able to provide for the %s parameter ',
          async (parameter) => {
            const { app, loggedInUserId } = getApp();
            const response = await supertest(app)
              .patch(`/users/${loggedInUserId}`)
              .send({ [parameter]: input });

            expect(response.status).toBe(200);
          },
        );
      });

      describe('telephone', () => {
        test('allow valid inputs', async () => {
          const { app, loggedInUserId } = getApp();
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              telephone: {
                countryCode: '+1',
                number: '212-970-4133',
              },
            });
          expect(response.status).toBe(200);
        });
        test('allows only country code', async () => {
          const { app, loggedInUserId } = getApp();
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              telephone: {
                countryCode: '+1',
              },
            });
          expect(response.status).toBe(200);
        });
        test('allows only number', async () => {
          const { app, loggedInUserId } = getApp();
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              telephone: {
                number: '212-970-4133',
              },
            });
          expect(response.status).toBe(200);
        });
        test('allows undefined telephone', async () => {
          const { app, loggedInUserId } = getApp();
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              telephone: undefined,
            });
          expect(response.status).toBe(200);
        });
      });
      describe('positions', () => {
        test('allows valid positions', async () => {
          const { app, loggedInUserId } = getApp();
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              positions: [
                {
                  role: 'CEO',
                  department: 'Research',
                  institution: 'Stark Enterprises',
                },
              ],
            });
          expect(response.status).toBe(200);
        });
        test('does not allows invalid positions', async () => {
          const { app, loggedInUserId } = getApp();
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              positions: [
                {
                  role: 'CEO',
                  department: 'Research',
                  institution: 'Stark Enterprises',
                  invalidField: 'An invalid field',
                },
              ],
            });
          expect(response.status).toBe(400);
        });
        test.each(['role', 'department', 'institution'])(
          'does not allows invalid %s',
          async (invalidProperty) => {
            const { app, loggedInUserId } = getApp();
            const response = await supertest(app)
              .patch(`/users/${loggedInUserId}`)
              .send({
                positions: [
                  {
                    role: 'CEO',
                    department: 'Research',
                    institution: 'Stark Enterprises',
                    [invalidProperty]: undefined,
                  },
                ],
              });
            expect(response.status).toBe(400);
          },
        );
      });
      describe('degrees', () => {
        test.each(userDegrees)('allows valid degree: %s', async (degree) => {
          const { app, loggedInUserId } = getApp();
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ degrees: [degree] });
          expect(response.status).toBe(200);
        });
        test('does not allow invalid degrees', async () => {
          const { app, loggedInUserId } = getApp();
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ degrees: ['invalid degree'] });
          expect(response.status).toBe(400);
        });
      });
      describe('regions', () => {
        test.each(userRegions)('allows valid region: %s', async (region) => {
          const { app, loggedInUserId } = getApp();
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ region });
          expect(response.status).toBe(200);
        });
        test('does not allow invalid regions', async () => {
          const { app, loggedInUserId } = getApp();
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ region: 'invalid region' });
          expect(response.status).toBe(400);
        });
      });
    });

    describe('Profile completeness validation', () => {
      test('Should return an error when attempting to onboard the user with incomplete profile (missing questions)', async () => {
        const incompleteUserResponse: gp2.UserResponse = {
          ...getUserResponse(),
          positions: [],
        };
        userControllerMock.update.mockResolvedValueOnce(incompleteUserResponse);

        const { app, loggedInUserId } = getApp();
        const response = await supertest(app)
          .patch(`/users/${loggedInUserId}`)
          .send({ onboarded: true });

        expect(response.status).toBe(422);
        expect(response.body).toMatchObject({
          message: 'User profile is not complete',
        });
      });

      test('Should not return an error when updating a user with incomplete profile while sending onboarded flag set to false', async () => {
        const incompleteUserResponse: gp2.UserResponse = {
          ...getUserResponse(),
          onboarded: false,
          positions: [],
        };
        userControllerMock.update.mockResolvedValueOnce(incompleteUserResponse);

        const { app, loggedInUserId } = getApp();
        const response = await supertest(app)
          .patch(`/users/${loggedInUserId}`)
          .send({ onboarded: false });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(incompleteUserResponse);
      });
      test('Should update and onboard the user', async () => {
        const nonOnboardedUserResponse: gp2.UserResponse = {
          ...getUserResponse(),
          onboarded: false,
        };
        userControllerMock.update.mockResolvedValueOnce(
          nonOnboardedUserResponse,
        );

        const onboardedUserResponse: gp2.UserResponse = {
          ...getUserResponse(),
          onboarded: true,
        };
        userControllerMock.update.mockResolvedValueOnce(onboardedUserResponse);

        const { app, loggedInUserId } = getApp();
        const response = await supertest(app)
          .patch(`/users/${loggedInUserId}`)
          .send({ onboarded: true, firstName: 'Peter' });

        expect(response.body).toEqual(onboardedUserResponse);
      });
    });
  });
  const getApp = () => {
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
      userController: userControllerMock,
      authHandler: authHandlerMock,
      logger: loggerMock,
    });
    return { app, loggedInUserId };
  };
});
