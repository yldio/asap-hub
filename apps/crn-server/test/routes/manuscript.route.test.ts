import { createUserResponse } from '@asap-hub/fixtures';
import { ManuscriptPostRequest, UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';

import { appFactory } from '../../src/app';
import {
  getManuscriptCreateDataObject,
  getManuscriptResponse,
} from '../fixtures/manuscript.fixtures';
import { loggerMock } from '../mocks/logger.mock';
import { manuscriptControllerMock } from '../mocks/manuscript.controller.mock';

describe('/manuscripts/ route', () => {
  const userMockFactory = jest.fn<UserResponse, []>();
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = userMockFactory();
    next();
  };

  const app = appFactory({
    manuscriptController: manuscriptControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(() => {
    userMockFactory.mockReturnValue(createUserResponse());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /manuscripts/{id}', () => {
    test('Should return a 404 error when manuscript is not found', async () => {
      manuscriptControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get('/manuscripts/123');

      expect(response.status).toBe(404);
    });

    test('Should return 403 when not allowed to get the manuscript', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
      });

      const response = await supertest(app).get('/manuscripts/123');

      expect(response.status).toEqual(403);
    });

    test('Should return the result correctly', async () => {
      const manuscriptResponse = getManuscriptResponse();

      manuscriptControllerMock.fetchById.mockResolvedValueOnce(
        manuscriptResponse,
      );

      const response = await supertest(app).get('/manuscripts/123');

      expect(response.body).toEqual(manuscriptResponse);
    });

    test('Should call the controller with the right parameter', async () => {
      const manuscriptId = 'abc123';

      await supertest(app).get(`/manuscripts/${manuscriptId}`);

      expect(manuscriptControllerMock.fetchById).toHaveBeenCalledWith(
        manuscriptId,
      );
    });
  });

  describe('POST /manuscripts/', () => {
    const manuscriptResponse = getManuscriptResponse();

    test('Should return 403 when not allowed to create a manuscript because user is not onboarded', async () => {
      const createManuscriptRequest = getManuscriptCreateDataObject();

      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
      });

      const response = await supertest(app)
        .post('/manuscripts')
        .send(createManuscriptRequest)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(403);
    });

    test('Should return 403 when not allowed to create a manuscript because user does not belong to the team', async () => {
      const createManuscriptRequest: ManuscriptPostRequest = {
        ...getManuscriptCreateDataObject(),
        teamId: 'team-3',
      };

      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        teams: [
          {
            role: 'Key Personnel',
            displayName: 'Test 1',
            id: 'test-1',
          },
          {
            role: 'Collaborating PI',
            displayName: 'Test 2',
            id: 'test-2',
          },
        ],
      });

      const response = await supertest(app)
        .post('/manuscripts')
        .send(createManuscriptRequest)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(403);
    });

    test('Should return a 201 when is hit', async () => {
      const teamId = 'team-1';

      const createManuscriptRequest: ManuscriptPostRequest = {
        ...getManuscriptCreateDataObject(),
        teamId,
      };

      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        teams: [
          {
            role: 'Key Personnel',
            displayName: 'Test 1',
            id: teamId,
          },
        ],
      });

      manuscriptControllerMock.create.mockResolvedValueOnce(manuscriptResponse);

      const response = await supertest(app)
        .post('/manuscripts')
        .send(createManuscriptRequest)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(manuscriptControllerMock.create).toHaveBeenCalledWith(
        createManuscriptRequest,
      );

      expect(response.body).toEqual(manuscriptResponse);
    });
  });
});
