import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { loggerMock } from '../mocks/logger.mock';
import { discussionControllerMock } from '../mocks/discussion.controller.mock';
import { getDiscussionDataObject } from '../fixtures/discussions.fixtures';
import { manuscriptControllerMock } from '../mocks/manuscript.controller.mock';

describe('/discussions/ route', () => {
  const userMockFactory = jest.fn<UserResponse, []>();
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
          text: 'response',
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
        });

      expect(response.status).toEqual(403);
    });

    test('Should return the results correctly', async () => {
      discussionControllerMock.update.mockResolvedValueOnce(discussionResponse);

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'A good reply',
        });

      expect(response.body.discussion).toEqual(discussionResponse);
    });

    test('Should call the controller with the right parameters', async () => {
      const discussionId = 'discussion-id-1';
      const text = 'test reply';

      const reply = { text, userId: 'user-id-0' };

      await supertest(app).patch(`/discussions/${discussionId}`).send({
        text,
      });

      expect(discussionControllerMock.update).toBeCalledWith(
        discussionId,
        reply,
      );
    });

    test('Should not accept a string of over 256 characters for the reply', async () => {
      const discussionId = 'discussion-id-1';

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'x'.repeat(257),
        });

      expect(response.status).toBe(400);
    });

    test('Should update manuscript status when manuscriptId is provided and user is not an open science team member', async () => {
      const manuscriptId = 'manuscript-id-1';
      const discussionId = 'discussion-id-1';
      const userId = 'user-id-0';

      // Mock user who is not an open science team member
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        openScienceTeamMember: false,
        id: userId,
      });

      manuscriptControllerMock.update.mockResolvedValueOnce({
        id: manuscriptId,
        status: 'Waiting for OS Team Reply',
        title: 'Sample Title',
        teamId: 'team-id-1',
        versions: [],
        count: 0,
      });

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'A reply',
          manuscriptId,
        });

      expect(manuscriptControllerMock.update).toHaveBeenCalledWith(
        manuscriptId,
        { status: 'Waiting for OS Team Reply' },
        userId,
      );
      expect(response.body.manuscript).toEqual({
        id: manuscriptId,
        status: 'Waiting for OS Team Reply',
        title: 'Sample Title',
        teamId: 'team-id-1',
        versions: [],
        count: 0,
      });
    });

    test('Should not update manuscript status when manuscriptId is provided and user is an open science team member', async () => {
      const manuscriptId = 'manuscript-id-2';
      const discussionId = 'discussion-id-2';

      // Mock user who is an open science team member
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        openScienceTeamMember: true,
      });

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'Another reply',
          manuscriptId,
        });

      expect(manuscriptControllerMock.update).not.toHaveBeenCalled();
      expect(response.body.manuscript).toBeUndefined();
    });

    test('Should not call manuscriptController.update if manuscriptId is not provided', async () => {
      const discussionId = 'discussion-id-3';

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}`)
        .send({
          text: 'Reply without manuscript',
        });

      expect(manuscriptControllerMock.update).not.toHaveBeenCalled();
      expect(response.body.manuscript).toBeUndefined();
    });
  });

  describe('POST /discussions', () => {
    test('Should return a 400 error when the payload is invalid', async () => {
      const response = await supertest(app).post(`/discussions`).send({
        message: 'something',
        id: 'some-id',
        type: 'wrong-type', // should be undefined or 'compliance-report' only
      });

      expect(response.status).toBe(400);
    });

    test('Should return a 400 error when additional properties exist', async () => {
      const response = await supertest(app).post(`/discussions`).send({
        id: 'some-id',
        message: 'response',
        additionalField: 'some-data',
      });

      expect(response.status).toBe(400);
    });

    test('Should return the results correctly', async () => {
      discussionControllerMock.create.mockResolvedValueOnce(discussionResponse);

      const response = await supertest(app).post(`/discussions`).send({
        id: 'some-id',
        message: 'A good message',
      });

      expect(response.body).toEqual(discussionResponse);
    });

    test('Should call the controller with the right parameters when type not set to compliance-report', async () => {
      const id = 'compliance-report-id-0';
      const message = 'test reply';

      const discussion = {
        text: message,
        userId: 'user-id-0',
        type: undefined,
      };

      await supertest(app).post(`/discussions`).send({
        message,
        id,
      });

      expect(discussionControllerMock.create).toBeCalledWith(discussion);
    });

    test('Should call the controller with the right parameters when type is set to compliance-report', async () => {
      const id = 'compliance-report-id-0';
      const message = 'test reply';
      const type = 'compliance-report';

      await supertest(app).post(`/discussions`).send({
        message,
        id,
        type,
      });

      const discussion = {
        text: message,
        userId: 'user-id-0',
        type,
        complianceReportId: 'compliance-report-id-0',
      };

      expect(discussionControllerMock.create).toBeCalledWith(discussion);
    });

    test('Should not accept discussion message over 256 characters', async () => {
      const id = 'compliance-report-id-0';
      const message = 'A'.repeat(257);

      const response = await supertest(app).post(`/discussions`).send({
        message,
        id,
      });

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /discussions/{discussion_id}/end', () => {
    test('Should return 403 when user not allowed to end the discussion', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
      });

      const response = await supertest(app)
        .patch(`/discussions/${discussionId}/end`)
        .send({
          text: 'response',
        });

      expect(response.status).toEqual(403);
    });

    test('Should return 404 when the discussion does not exist', async () => {
      discussionControllerMock.endDiscussion.mockRejectedValueOnce(
        Boom.notFound(),
      );

      const response = await supertest(app).patch(
        `/discussions/${discussionId}-wrong/end`,
      );

      expect(response.status).toBe(404);
    });

    test('Should return 200 when the discussion id is valid', async () => {
      const response = await supertest(app).patch(
        `/discussions/${discussionId}/end`,
      );

      expect(response.status).toBe(200);
    });
  });
});
