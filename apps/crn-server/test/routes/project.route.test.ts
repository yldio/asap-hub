import 'express-async-errors';
import express from 'express';
import supertest from 'supertest';
import Boom from '@hapi/boom';
import { NotFoundError } from '@asap-hub/errors';
import { ListProjectDataObject } from '@asap-hub/model';

import { projectRouteFactory } from '../../src/routes/project.route';
import {
  getExpectedDiscoveryProject,
  getExpectedProjectList,
} from '../fixtures/projects.fixtures';
import ProjectController from '../../src/controllers/project.controller';

const projectControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
} as unknown as jest.Mocked<ProjectController>;

const createApp = () => {
  const app = express();
  app.use(projectRouteFactory(projectControllerMock));
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (Boom.isBoom(err)) {
        res.status(err.output.statusCode).json(err.output.payload);
        return;
      }
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: (err as Error).message });
    },
  );
  return app;
};

describe('project routes', () => {
  const app = createApp();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /projects', () => {
    it('returns the project list from the controller', async () => {
      const list = getExpectedProjectList();
      projectControllerMock.fetch.mockResolvedValueOnce(
        list as unknown as ListProjectDataObject,
      );

      const response = await supertest(app).get('/projects');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(list);
      expect(projectControllerMock.fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          take: undefined,
          skip: undefined,
          search: undefined,
          filter: undefined,
        }),
      );
    });

    it('normalises query parameters before calling the controller', async () => {
      projectControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      await supertest(app)
        .get('/projects')
        .query({
          take: 20,
          skip: 5,
          search: 'alpha',
          projectType: ['Discovery', 'Resource'],
          status: ['Active'],
          tags: ['Data'],
          teamId: 'team-3',
        });

      expect(projectControllerMock.fetch).toHaveBeenCalledWith({
        take: 20,
        skip: 5,
        search: 'alpha',
        filter: {
          projectType: ['Discovery', 'Resource'],
          status: 'Active',
          tags: ['Data'],
          teamId: 'team-3',
        },
      });
    });

    it('returns 400 for invalid query parameters', async () => {
      const response = await supertest(app)
        .get('/projects')
        .query({ take: 'invalid' });

      expect(response.status).toBe(400);
      expect(projectControllerMock.fetch).not.toHaveBeenCalled();
    });
  });

  describe('GET /project/:projectId', () => {
    it('returns the project when found', async () => {
      const project = getExpectedDiscoveryProject();
      projectControllerMock.fetchById.mockResolvedValueOnce(project);

      const response = await supertest(app).get('/project/discovery-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(project);
      expect(projectControllerMock.fetchById).toHaveBeenCalledWith(
        'discovery-1',
      );
    });

    it('maps not found errors to a 404 response', async () => {
      projectControllerMock.fetchById.mockRejectedValueOnce(
        new NotFoundError(undefined, 'project missing'),
      );

      const response = await supertest(app).get('/project/missing');

      expect(response.status).toBe(404);
    });
  });
});
