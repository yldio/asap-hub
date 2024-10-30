import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { loggerMock } from '../mocks/logger.mock';
import { discussionControllerMock } from '../mocks/discussion.controller.mock';
import { getDiscussionDataObject } from '../fixtures/discussions.fixtures';

describe('/discussions/ route', () => {
  //   const loggedUser: User = {
  //     ...createAuthUser(),
  //     teams: [
  //       {
  //         id: 'team-id-1',
  //         role: 'Project Manager',
  //       },
  //     ],
  //   };
  //   const getLoggedUser = jest.fn().mockReturnValue(loggedUser);
  //   const authHandlerMock: AuthHandler = (req, _res, next) => {
  //     req.loggedInUser = getLoggedUser();
  //     next();
  //   };
  //   const app = appFactory({
  //     discussionController: discussionControllerMock,
  //     authHandler: authHandlerMock,
  //     logger: loggerMock,
  //   });

  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });
  const userMockFactory = jest.fn<UserResponse, []>();
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = userMockFactory();
    next();
  };

  const app = appFactory({
    discussionController: discussionControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(() => {
    userMockFactory.mockReturnValue({ ...createUserResponse(), role: 'Staff' });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const discussionResponse = getDiscussionDataObject();
  const discussionId = discussionResponse.id;

  describe('GET /discussions/{discussion_id}', () => {
    test('Should return a 404 error when the discussion is not found', async () => {
      discussionControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get(`/discussions/${discussionId}`);

      expect(response.status).toBe(404);
    });

    test('Should return the result correctly', async () => {
      discussionControllerMock.fetchById.mockResolvedValueOnce(
        discussionResponse,
      );

      const response = await supertest(app).get(`/discussions/${discussionId}`);

      expect(response.body).toEqual(discussionResponse);
    });

    test('Should call the controller with the right parameter', async () => {
      discussionControllerMock.fetchById.mockResolvedValueOnce(
        discussionResponse,
      );

      await supertest(app).get(`/discussions/${discussionId}`);

      expect(discussionControllerMock.fetchById).toHaveBeenCalledWith(
        discussionId,
      );
    });

    test('Should return 403 when not allowed to get the discussion', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
      });

      const response = await supertest(app).get(`/discussions/${discussionId}`);

      expect(response.status).toEqual(403);
    });
  });

  describe('PATCH /discussions/{discussion_id}', () => {
    test('Should return a 400 error when the payload is invalid', async () => {
      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          message: 'something',
        });

      expect(response.status).toBe(400);
    });

    test('Should return a 400 error when additional properties exist', async () => {
      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          replyText: 'response',
          additionalField: 'some-data',
        });

      expect(response.status).toBe(400);
    });

    test('Should return a 404 error when the discussion does not exist', async () => {
      discussionControllerMock.update.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          replyText: 'response',
        });

      expect(response.status).toBe(404);
    });

    test('Should return 403 when user not allowed to update the discussion', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
      });

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          replyText: 'response',
        });

      expect(response.status).toEqual(403);
    });

    test('Should return the results correctly', async () => {
      discussionControllerMock.update.mockResolvedValueOnce(discussionResponse);

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          replyText: 'A good reply',
        });

      expect(response.body).toEqual(discussionResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      const discussionId = 'discussion-id-1';
      const replyText = 'test reply';

      const reply = { text: replyText, userId: 'user-id-0' };

      await supertest(app).patch(`/discussions/${discussionId}`).send({
        replyText,
      });

      expect(discussionControllerMock.update).toBeCalledWith(
        discussionId,
        reply,
      );
    });
  });
});
