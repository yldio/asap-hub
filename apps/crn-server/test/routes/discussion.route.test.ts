import { createUserResponse } from '@asap-hub/fixtures';
import { Reply, UserResponse, ManuscriptResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { loggerMock } from '../mocks/logger.mock';
import { discussionControllerMock } from '../mocks/discussion.controller.mock';
import { getDiscussionDataObject } from '../fixtures/discussions.fixtures';
import { manuscriptControllerMock } from '../mocks/manuscript.controller.mock';

describe('/discussions/ route', () => {
  const userMockFactory = jest.fn<UserResponse | undefined, []>();
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = userMockFactory();
    next();
  };

  const app = appFactory({
    discussionController: discussionControllerMock,
    manuscriptController: manuscriptControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(() => {
    userMockFactory.mockReturnValue({ ...createUserResponse(), role: 'Staff' });
    manuscriptControllerMock.fetchById.mockResolvedValue({
      id: 'manuscript-id',
      status: 'Submit Final Publication',
    } as ManuscriptResponse);
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

    test('Should return 403 when loggedInUser is undefined', async () => {
      userMockFactory.mockReturnValueOnce(undefined);

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
          text: 'response',
          manuscriptId: 'manuscript-id',
          additionalField: 'some-data',
        });

      expect(response.status).toBe(400);
    });

    test('Should return a 404 error when the discussion does not exist', async () => {
      discussionControllerMock.update.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'response',
          manuscriptId: 'manuscript-id',
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
          text: 'response',
          manuscriptId: 'manuscript-id',
        });

      expect(response.status).toEqual(403);
    });

    test('Should return 403 when manuscript is compliant', async () => {
      manuscriptControllerMock.fetchById.mockResolvedValueOnce({
        id: 'manuscript-id',
        status: 'Compliant',
      } as ManuscriptResponse);

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'response',
          manuscriptId: 'manuscript-id',
        });

      expect(response.status).toEqual(403);
      expect(response.body.message).toEqual(
        'The manuscript status has been changed to compliant or closed, which disables new discussions and replies.',
      );
    });

    test('Should return 403 when manuscript is closed', async () => {
      manuscriptControllerMock.fetchById.mockResolvedValueOnce({
        id: 'manuscript-id',
        status: 'Closed (other)',
      } as ManuscriptResponse);

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'response',
          manuscriptId: 'manuscript-id',
        });

      expect(response.status).toEqual(403);
      expect(response.body.message).toEqual(
        'The manuscript status has been changed to compliant or closed, which disables new discussions and replies.',
      );
    });

    test('Should return the results correctly', async () => {
      discussionControllerMock.update.mockResolvedValueOnce(discussionResponse);

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'A good reply',
          manuscriptId: 'manuscript-id',
        });

      expect(response.body).toEqual(discussionResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      const discussionId = 'discussion-id-1';
      const text = 'test reply';
      const manuscriptId = 'manuscript-id';
      const notificationList = 'user1,user2';

      const reply: Reply = { text, isOpenScienceMember: false };

      await supertest(app).patch(`/discussions/${discussionId}`).send({
        text,
        manuscriptId,
        notificationList,
      });

      expect(discussionControllerMock.update).toHaveBeenCalledWith(
        discussionId,
        'user-id-0',
        reply,
        manuscriptId,
        notificationList,
      );
    });

    test('Should accept a string of over 256 characters for the reply', async () => {
      const discussionId = 'discussion-id-1';

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'x'.repeat(257),
          manuscriptId: 'manuscript-id',
        });

      expect(response.status).toBe(200);
    });

    test('Should return 403 when loggedInUser is undefined', async () => {
      userMockFactory.mockReturnValueOnce(undefined);

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'response',
          manuscriptId: 'manuscript-id',
        });

      expect(response.status).toEqual(403);
    });
  });

  describe('PATCH /discussions/{discussion_id}/read', () => {
    test('Should return a 404 error when the discussion does not exist', async () => {
      discussionControllerMock.update.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).patch(
        `/discussions/${discussionId}/read`,
      );

      expect(response.status).toBe(404);
    });

    test('Should return 403 when user not allowed to update the discussion', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
      });

      const response = await supertest(app).patch(
        `/discussions/${discussionId}/read`,
      );

      expect(response.status).toEqual(403);
    });

    test('Should return the results correctly', async () => {
      discussionControllerMock.update.mockResolvedValueOnce(discussionResponse);

      const response = await supertest(app).patch(
        `/discussions/${discussionId}/read`,
      );

      expect(response.body).toEqual(discussionResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      const discussionId = 'discussion-id-1';

      await supertest(app).patch(`/discussions/${discussionId}/read`);

      expect(discussionControllerMock.update).toHaveBeenCalledWith(
        discussionId,
        'user-id-0',
      );
    });

    test('Should return 403 when loggedInUser is undefined', async () => {
      userMockFactory.mockReturnValueOnce(undefined);

      const response = await supertest(app).patch(
        `/discussions/${discussionId}/read`,
      );

      expect(response.status).toEqual(403);
    });
  });

  describe('POST /discussions', () => {
    test('Should return a 400 error when the payload is invalid', async () => {
      const response = await supertest(app).post(`/discussions`).send({
        message: 'something',
        id: 'some-id',
      });

      expect(response.status).toBe(400);
    });

    test('Should return a 400 error when additional properties exist', async () => {
      const response = await supertest(app).post(`/discussions`).send({
        manuscriptId: 'manuscript-id',
        title: 'A good title',
        text: 'A good message',
        additionalField: 'some-data',
      });

      expect(response.status).toBe(400);
    });

    test('Should return 403 when manuscript is compliant', async () => {
      manuscriptControllerMock.fetchById.mockResolvedValueOnce({
        id: 'manuscript-id',
        status: 'Compliant',
      } as ManuscriptResponse);

      const response = await supertest(app).post(`/discussions`).send({
        manuscriptId: 'manuscript-id',
        title: 'A good title',
        text: 'A good message',
      });

      expect(response.status).toEqual(403);
      expect(response.body.message).toEqual(
        'The manuscript status has been changed to compliant or closed, which disables new discussions and replies.',
      );
    });

    test('Should return 403 when manuscript is closed', async () => {
      manuscriptControllerMock.fetchById.mockResolvedValueOnce({
        id: 'manuscript-id',
        status: 'Closed (other)',
      } as ManuscriptResponse);

      const response = await supertest(app).post(`/discussions`).send({
        manuscriptId: 'manuscript-id',
        title: 'A good title',
        text: 'A good message',
      });

      expect(response.status).toEqual(403);
      expect(response.body.message).toEqual(
        'The manuscript status has been changed to compliant or closed, which disables new discussions and replies.',
      );
    });

    test('Should return the results correctly', async () => {
      discussionControllerMock.create.mockResolvedValueOnce(discussionResponse);

      const response = await supertest(app).post(`/discussions`).send({
        manuscriptId: 'manuscript-id',
        title: 'A good title',
        text: 'A good message',
        notificationList: 'user1,user2',
      });

      expect(response.body).toEqual(discussionResponse);
    });

    test('Should not accept discussion title over 100 characters', async () => {
      const title = 'A'.repeat(101);

      const response = await supertest(app).post(`/discussions`).send({
        manuscriptId: 'manuscript-id',
        title,
        text: 'A good message',
      });

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({
        data: [
          {
            instancePath: '/title',
            keyword: 'maxLength',
            message: 'must NOT have more than 100 characters',
            params: { limit: 100 },
            schemaPath: '#/properties/title/maxLength',
          },
        ],
        error: 'Bad Request',
        message: 'Validation error',
        statusCode: 400,
      });
    });

    test('Should accept discussion text over 256 characters', async () => {
      const text = 'A'.repeat(257);

      const response = await supertest(app).post(`/discussions`).send({
        manuscriptId: 'manuscript-id',
        title: 'A good title',
        text,
      });

      expect(response.status).toBe(200);
    });

    test('Should return 403 when loggedInUser is undefined', async () => {
      userMockFactory.mockReturnValueOnce(undefined);

      const response = await supertest(app).post(`/discussions`).send({
        manuscriptId: 'manuscript-id',
        title: 'A good title',
        text: 'A good message',
      });

      expect(response.status).toEqual(403);
    });
  });
});
