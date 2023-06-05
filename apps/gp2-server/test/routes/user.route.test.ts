import { gp2 } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import Crypto from 'crypto';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import {
  fetchExpectation,
  getUserResponse,
  updateAvatarBody,
  userPatchRequest,
} from '../fixtures/user.fixtures';
import { loggerMock } from '../mocks/logger.mock';
import { userControllerMock } from '../mocks/user-controller.mock';

const { userDegrees, userRegions, keywords, userContributingCohortRole } = gp2;

describe('/users/ route', () => {
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

  beforeEach(() => {
    getLoggedUser.mockReturnValue(loggedUser);
  });

  afterEach(jest.resetAllMocks);

  describe('GET /users', () => {
    test('Should return 200 when no users exist', async () => {
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
      userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

      const response = await supertest(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fetchExpectation);
    });

    test('Should call the controller method with the correct parameters', async () => {
      userControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const params: gp2.FetchUsersOptions = {
        take: 15,
        skip: 5,
        search: 'something',
        filter: {
          code: '123',
          onlyOnboarded: true,
          regions: ['Europe'],
        },
      };
      await supertest(app).get('/users').query(params);

      const expectedParams: gp2.FetchUsersOptions = {
        take: 15,
        skip: 5,
        search: 'something',
        filter: {
          code: '123',
          onlyOnboarded: true,
          regions: ['Europe'],
        },
      };

      expect(userControllerMock.fetch).toBeCalledWith(expectedParams);
    });

    describe('Parameter validation', () => {
      test('Should return a 400 error when additional properties exist', async () => {
        const response = await supertest(app).get('/users').query({
          additionalField: 'some-data',
        });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app).get('/users').query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });

      test.each`
        name               | value
        ${'regions'}       | ${['Africa']}
        ${'keywords'}      | ${['Aging']}
        ${'projects'}      | ${['a project']}
        ${'workingGroups'} | ${['a working group']}
        ${'regions'}       | ${['Africa', 'Asia']}
        ${'keywords'}      | ${['Aging', 'RNA']}
        ${'projects'}      | ${['a project', 'another project']}
        ${'workingGroups'} | ${['a working group', 'another working group']}
      `(
        'Should return the results correctly when a filter is used for $name',
        async ({ name, value }) => {
          userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);

          const response = await supertest(app)
            .get('/users')
            .query({
              filter: { [name]: value },
            });

          expect(response.status).toBe(200);
        },
      );

      test('Should return 200 when an administrator asks for non-onboarded users', async () => {
        userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);
        getLoggedUser.mockReturnValue({
          ...loggedUser,
          role: 'Administrator',
        });
        const response = await supertest(app)
          .get('/users')
          .query({
            filter: { onlyOnboarded: false },
          });

        expect(response.status).toBe(200);
      });

      test('Should return a 403 when a non-administrator asks for non-onboarded users', async () => {
        userControllerMock.fetch.mockResolvedValueOnce(fetchExpectation);
        getLoggedUser.mockReturnValue({
          ...loggedUser,
          role: 'Trainee',
        });
        const response = await supertest(app)
          .get('/users')
          .query({
            filter: { onlyOnboarded: false },
          });

        expect(response.status).toBe(403);
      });
    });
  });

  describe('GET /users/{user_id}', () => {
    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get('/users/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());

      const response = await supertest(app).get('/users/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getUserResponse());
    });

    test('Should call the controller with the right parameter', async () => {
      const userId = 'abc123';

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

      const response = await supertest(app).get('/users/invites/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      userControllerMock.fetchByCode.mockResolvedValueOnce(getUserResponse());

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

      await supertest(app).get(`/users/invites/${code}`);

      expect(userControllerMock.fetchByCode).toBeCalledWith(code);
    });
  });
  describe('PATCH /users/{user_id}', () => {
    test('Should return the results correctly', async () => {
      userControllerMock.update.mockResolvedValueOnce(getUserResponse());

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

      const response = await supertest(app)
        .patch(`/users/${loggedInUserId}`)
        .send({ firstName: 'Peter' });

      expect(response.status).toBe(500);
    });

    test('Returns 403 when user is changing other user', async () => {
      const response = await supertest(app)
        .patch('/users/not-me')
        .send({ firstName: 'Peter' });
      expect(response.status).toBe(403);
    });

    test('Should return 404 when user doesnt exist', async () => {
      userControllerMock.update.mockRejectedValueOnce(Boom.notFound());

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
      await supertest(app)
        .patch(`/users/${loggedInUserId}`)
        .send(requestParams);
      const { onboarded, ...remainingParams } = userPatchRequest;

      expect(userControllerMock.update).toBeCalledWith(
        loggedInUserId,
        remainingParams,
      );
      expect(userControllerMock.update).toBeCalledWith(loggedInUserId, {
        onboarded,
      });
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(app)
          .patch(`/users/${loggedInUserId}`)
          .send({ firstName: 666 });

        expect(response.status).toBe(400);
      });
      describe.each`
        description        | input
        ${'null'}          | ${null}
        ${'random string'} | ${'random string'}
      `('accepts $description as an input', ({ input }) => {
        test.each([
          'firstName',
          'lastName',
          'country',
          'city',
          'biography',
          'fundingStreams',
        ])(
          'Should be able to provide for the %s parameter ',
          async (parameter) => {
            const response = await supertest(app)
              .patch(`/users/${loggedInUserId}`)
              .send({ [parameter]: input });

            expect(response.status).toBe(200);
          },
        );
      });

      test.each`
        field               | status | optional
        ${'firstName'}      | ${400} | ${false}
        ${'lastName'}       | ${400} | ${false}
        ${'country'}        | ${400} | ${false}
        ${'city'}           | ${200} | ${true}
        ${'biography'}      | ${400} | ${false}
        ${'fundingStreams'} | ${200} | ${true}
      `(
        'the parameter $field should allow for an empty string $optional',
        async ({ field, status }) => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ [field]: '' });

          expect(response.status).toBe(status);
        },
      );
      test('allows null for secondary email', async () => {
        const response = await supertest(app)
          .patch(`/users/${loggedInUserId}`)
          .send({
            alternativeEmail: null,
          });
        expect(response.status).toBe(200);
      });
      test('does not allow invalid secondary email', async () => {
        const response = await supertest(app)
          .patch(`/users/${loggedInUserId}`)
          .send({
            alternativeEmail: 'invalid-email',
          });
        expect(response.status).toBe(400);
      });

      describe('telephone', () => {
        test('allow valid inputs', async () => {
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
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              telephone: {
                countryCode: '+1',
              },
            });
          expect(response.status).toBe(200);
        });
        test('does not allow invalid country code', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              telephone: {
                countryCode: 'invalid-code',
              },
            });
          expect(response.status).toBe(400);
        });
        test('allows only number', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              telephone: {
                number: '212-970-4133',
              },
            });
          expect(response.status).toBe(200);
        });
        test('does not allow invalid number', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              telephone: {
                number: 'invalid-number',
              },
            });
          expect(response.status).toBe(400);
        });
        test('allows undefined telephone', async () => {
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
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ degrees: [degree] });
          expect(response.status).toBe(200);
        });
        test('allows empty degrees', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ degrees: [] });
          expect(response.status).toBe(200);
        });
        test('does not allow invalid degrees', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ degrees: ['invalid degree'] });
          expect(response.status).toBe(400);
        });
      });
      describe('regions', () => {
        test.each(userRegions)('allows valid region: %s', async (region) => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ region });
          expect(response.status).toBe(200);
        });
        test('does not allow invalid regions', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ region: 'invalid region' });
          expect(response.status).toBe(400);
        });
      });
      describe('keywords', () => {
        test.each(keywords)('allows valid keywords: %s', async (keyword) => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ keywords: [keyword] });
          expect(response.status).toBe(200);
        });
        test('does not allow invalid keywords', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ keywords: ['invalid keyword'] });
          expect(response.status).toBe(400);
        });
        test('not allows empty keywords', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ keywords: [] });
          expect(response.status).toBe(400);
        });
        test('allows 10 keywords', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ keywords: keywords.slice(0, 10) });
          expect(response.status).toBe(200);
        });
        test('allows no more than 10 keywords', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ keywords: keywords.slice(0, 11) });
          expect(response.status).toBe(400);
        });
      });
      describe('questions', () => {
        test('allows valid questions', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ questions: ['a'] });
          expect(response.status).toBe(200);
        });
        test('allows 5 questions', async () => {
          const questions = Array.from(
            { length: 5 },
            (_, index) => `a question ${index}`,
          );
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ questions });
          expect(response.status).toBe(200);
        });
        test('allows no more than 5 questions', async () => {
          const questions = Array.from(
            { length: 6 },
            (_, index) => `a question ${index}`,
          );
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ questions });
          expect(response.status).toBe(400);
        });
        test('allows a question of 250 chars', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ questions: ['a'.repeat(250)] });
          expect(response.status).toBe(200);
        });
        test('does not allow a question of more than 250 chars', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ questions: ['a'.repeat(251)] });
          expect(response.status).toBe(400);
        });
        test.each([null, ''])(
          'does not allow a empty question',
          async (question) => {
            const response = await supertest(app)
              .patch(`/users/${loggedInUserId}`)
              .send({ questions: [question] });
            expect(response.status).toBe(400);
          },
        );
      });
      describe.each`
        field               | length
        ${'fundingStreams'} | ${1000}
        ${'biography'}      | ${2500}
      `('maximum lenght for $field should be $length', ({ field, length }) => {
        test('Should be able to provide a string of characters', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              [field]: 'x'.repeat(length),
            });

          expect(response.status).toBe(200);
        });

        test('Should not accept a string over the maximum', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              [field]: 'x'.repeat(length + 1),
            });

          expect(response.status).toBe(400);
        });
      });
      describe('contributing cohorts', () => {
        const cohort = (
          id = '42',
        ): NonNullable<
          gp2.UserPatchRequest['contributingCohorts']
        >[number] => ({
          contributingCohortId: id,
          role: 'Investigator',
          studyUrl: 'http://example.com',
        });
        test('allows valid cohorts', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              contributingCohorts: [cohort()],
            });
          expect(response.status).toBe(200);
        });
        test('studyUrl is optional', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              contributingCohorts: [
                {
                  ...cohort(),
                  studyUrl: undefined,
                },
              ],
            });
          expect(response.status).toBe(200);
        });
        test('allows 10 cohorts', async () => {
          const contributingCohorts = Array.from({ length: 10 }, (_, index) =>
            cohort(`${index}`),
          );
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ contributingCohorts });
          expect(response.status).toBe(200);
        });
        test('allows no more than 10 cohorts', async () => {
          const contributingCohorts = Array.from({ length: 11 }, (_, index) =>
            cohort(`${index}`),
          );
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({ contributingCohorts });
          expect(response.status).toBe(400);
        });
        test('a studyUrl needs to be a Url', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              contributingCohorts: [
                {
                  ...cohort(),
                  studyUrl: 'not-a-link',
                },
              ],
            });
          expect(response.status).toBe(400);
        });
        test.each(userContributingCohortRole)(
          'allows valid role: %s',
          async (role) => {
            const response = await supertest(app)
              .patch(`/users/${loggedInUserId}`)
              .send({
                contributingCohorts: [
                  {
                    ...cohort(),
                    role,
                  },
                ],
              });
            expect(response.status).toBe(200);
          },
        );
        test('does not allow invalid role', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              contributingCohorts: [
                {
                  ...cohort(),
                  role: 'not-a-role',
                },
              ],
            });
          expect(response.status).toBe(400);
        });
        test('does not allow invalid contributingCohortId', async () => {
          const response = await supertest(app)
            .patch(`/users/${loggedInUserId}`)
            .send({
              contributingCohorts: [
                {
                  ...cohort(),
                  contributingCohortId: undefined,
                },
              ],
            });
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

        const response = await supertest(app)
          .patch(`/users/${loggedInUserId}`)
          .send({ onboarded: true, firstName: 'Peter' });

        expect(response.body).toEqual(onboardedUserResponse);
      });
    });
  });
  describe('POST /users/{user_id}/avatar', () => {
    const user = { ...getUserResponse(), id: loggedInUserId };
    const userId = loggedInUserId;

    test('Should return the results correctly', async () => {
      userControllerMock.updateAvatar.mockResolvedValueOnce(user);

      const response = await supertest(app)
        .post(`/users/${userId}/avatar`)
        .send(updateAvatarBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
    });

    test('Should upload pictures of 2MB correctly', async () => {
      userControllerMock.updateAvatar.mockResolvedValueOnce(getUserResponse());
      const blob = Crypto.randomBytes(2097152).toString('base64');
      const updateLargeAvatar = {
        avatar: `data:image/jpeg;base64,${blob}`,
      };

      const response = await supertest(app)
        .post(`/users/${userId}/avatar`)
        .send(updateLargeAvatar);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getUserResponse());
    });

    test('Should return 500 when it fails to update the avatar', async () => {
      userControllerMock.updateAvatar.mockRejectedValueOnce(
        Boom.badImplementation('squidex', {
          data: 'Squidex Error Message',
        }),
      );

      const response = await supertest(app)
        .post(`/users/${userId}/avatar`)
        .send(updateAvatarBody);

      expect(response.status).toBe(500);
    });

    test('Returns 403 when user is changing other user', async () => {
      const response = await supertest(app)
        .post('/users/not-me/avatar')
        .send(updateAvatarBody);
      expect(response.status).toBe(403);
    });

    test('Should call the controller method with the correct parameters', async () => {
      await supertest(app)
        .post(`/users/${userId}/avatar`)
        .send(updateAvatarBody);

      expect(userControllerMock.updateAvatar).toBeCalledWith(
        userId,
        expect.any(Buffer),
        'image/jpeg',
      );
    });

    describe('Parameter validation', () => {
      test('Returns 400 when payload is invalid', async () => {
        const response = await supertest(app).post(`/users/${userId}/avatar`);
        expect(response.status).toBe(400);
      });

      test('Returns 400 when payload is not data URL conformant', async () => {
        const response = await supertest(app)
          .post(`/users/${userId}/avatar`)
          .send({ avatar: 'data:video/mp4' });
        expect(response.status).toBe(400);
      });

      test('Returns 415 when content type is invalid', async () => {
        const response = await supertest(app)
          .post(`/users/${userId}/avatar`)
          .send({ avatar: 'data:video/mp4;base64,some-data' });
        expect(response.status).toBe(415);
      });

      test('Returns 413 when avatar is too big', async () => {
        const response = await supertest(app)
          .post(`/users/${userId}/avatar`)
          .send({
            avatar: `data:image/jpeg;base64,${Buffer.alloc(4e6).toString(
              'base64',
            )}`,
          });
        expect(response.status).toBe(413);
      });
    });
  });
});
