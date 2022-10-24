import { User } from '@asap-hub/auth';
import { userMock } from '@asap-hub/fixtures';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import {
  getListProjectsResponse,
  getProjectResponse,
} from '../fixtures/project.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { projectControllerMock } from '../mocks/project-controller.mock';

describe('/projects/ route', () => {
  const app = appFactory({
    projectController: projectControllerMock,
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /projects', () => {
    test('Should return 200 when no projects are found', async () => {
      projectControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/projects');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      projectControllerMock.fetch.mockResolvedValueOnce(
        getListProjectsResponse(),
      );

      const response = await supertest(app).get('/projects');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListProjectsResponse());
    });

    test('Should call the controller fetch method', async () => {
      const loggedInUserId = '11';
      const loggedUser: User = {
        ...userMock,
        id: loggedInUserId,
      };
      const getLoggedUser = jest.fn().mockReturnValue(loggedUser);
      const authHandlerMock: AuthHandler = (req, _res, next) => {
        req.loggedInUser = getLoggedUser();
        next();
      };
      const appWithUser = appFactory({
        projectController: projectControllerMock,
        authHandler: authHandlerMock,
        logger: loggerMock,
      });
      await supertest(appWithUser).get('/projects');

      expect(projectControllerMock.fetch).toBeCalledWith(loggedInUserId);
    });
  });
  describe('GET /project/{project_id}', () => {
    test('Should return 404 when project doesnt exist', async () => {
      projectControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get('/project/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      projectControllerMock.fetchById.mockResolvedValueOnce(
        getProjectResponse(),
      );

      const response = await supertest(app).get('/project/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getProjectResponse());
    });

    test('Should call the controller with the right parameter', async () => {
      const ProjectId = 'abc123';
      const loggedInUserId = '11';
      const loggedUser: User = {
        ...userMock,
        id: loggedInUserId,
      };
      const getLoggedUser = jest.fn().mockReturnValue(loggedUser);
      const authHandlerMock: AuthHandler = (req, _res, next) => {
        req.loggedInUser = getLoggedUser();
        next();
      };
      const appWithUser = appFactory({
        projectController: projectControllerMock,
        authHandler: authHandlerMock,
        logger: loggerMock,
      });

      await supertest(appWithUser).get(`/project/${ProjectId}`);

      expect(projectControllerMock.fetchById).toBeCalledWith(
        ProjectId,
        loggedInUserId,
      );
    });
  });
});
