import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
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

  describe('POST /manuscripts/', () => {
    const manuscriptResponse = getManuscriptResponse();

    test('Should return a 201 when is hit', async () => {
      const createManuscriptRequest = getManuscriptCreateDataObject();

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
