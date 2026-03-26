import 'express-async-errors';
import express from 'express';
import supertest from 'supertest';
import Boom from '@hapi/boom';
import { NotFoundError } from '@asap-hub/errors';
import { ListProjectDataObject, ProjectResponse } from '@asap-hub/model';

import { projectRouteFactory } from '../../src/routes/project.route';
import {
  getExpectedDiscoveryProject,
  getExpectedProjectList,
  getExpectedTraineeProject,
} from '../fixtures/projects.fixtures';
import ProjectController from '../../src/controllers/project.controller';

const projectControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
  createMilestone: jest.fn(),
} as unknown as jest.Mocked<ProjectController>;

const createApp = (loggedInUser?: { teams: { id: string }[] }) => {
  const app = express();
  app.use(express.json());
  if (loggedInUser) {
    app.use(
      (
        req: express.Request,
        _res: express.Response,
        next: express.NextFunction,
      ) => {
        req.loggedInUser = loggedInUser as express.Request['loggedInUser'];
        next();
      },
    );
  }
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
  // discovery project has teamId: 'team-1'
  const app = createApp({ teams: [{ id: 'team-1' }] });

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

    it('returns 400 for invalid query parameters', async () => {
      const response = await supertest(app)
        .get('/projects')
        .query({ take: 'invalid' });

      expect(response.status).toBe(400);
      expect(projectControllerMock.fetch).not.toHaveBeenCalled();
    });

    it('maps single and multiple filter values to expected shapes', async () => {
      projectControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      await supertest(app)
        .get('/projects')
        .query({
          projectType: 'Discovery Project',
          status: ['Active', 'Closed'],
        });

      expect(projectControllerMock.fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: {
            projectType: 'Discovery Project',
            status: ['Active', 'Closed'],
          },
        }),
      );
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

  describe('PATCH /project/:projectId', () => {
    const tools = [{ name: 'Slack', url: 'https://slack.com' }];

    it('calls update with the project id and tools and returns the result', async () => {
      const project = getExpectedDiscoveryProject();
      const updated =
        getExpectedDiscoveryProject() as unknown as ProjectResponse;
      projectControllerMock.fetchById.mockResolvedValueOnce(project);
      projectControllerMock.update.mockResolvedValueOnce(updated);

      const response = await supertest(app)
        .patch('/project/discovery-1')
        .send({ tools });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updated);
      expect(projectControllerMock.update).toHaveBeenCalledWith(
        'discovery-1',
        tools,
      );
    });

    it('returns 403 when the user does not belong to the project team', async () => {
      const project = getExpectedDiscoveryProject(); // teamId: 'team-1'
      projectControllerMock.fetchById.mockResolvedValueOnce(project);

      const appWithOtherTeam = createApp({ teams: [{ id: 'other-team' }] });
      const response = await supertest(appWithOtherTeam)
        .patch('/project/discovery-1')
        .send({ tools });

      expect(response.status).toBe(403);
      expect(projectControllerMock.update).not.toHaveBeenCalled();
    });

    it('returns 403 when the project has no teamId', async () => {
      const project = getExpectedDiscoveryProject();
      const projectWithoutTeam = { ...project, teamId: undefined };
      projectControllerMock.fetchById.mockResolvedValueOnce(
        projectWithoutTeam as unknown as ProjectResponse,
      );

      const response = await supertest(app)
        .patch('/project/discovery-1')
        .send({ tools });

      expect(response.status).toBe(403);
      expect(projectControllerMock.update).not.toHaveBeenCalled();
    });

    it('returns 400 for an invalid request body', async () => {
      const response = await supertest(app)
        .patch('/project/discovery-1')
        .send({ tools: [{ name: 'Missing URL' }] });

      expect(response.status).toBe(400);
      expect(projectControllerMock.update).not.toHaveBeenCalled();
    });

    it('maps not found errors to a 404 response', async () => {
      projectControllerMock.fetchById.mockRejectedValueOnce(
        new NotFoundError(undefined, 'project missing'),
      );

      const response = await supertest(app)
        .patch('/project/missing')
        .send({ tools });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /project/:projectId/milestones', () => {
    const milestoneBody = {
      grantType: 'original',
      description: 'First milestone',
      status: 'Pending',
      aimIds: ['aim-1'],
    };

    it('returns 201 on success', async () => {
      const project = getExpectedTraineeProject();
      projectControllerMock.fetchById.mockResolvedValueOnce(project);
      projectControllerMock.createMilestone.mockResolvedValueOnce(
        'milestone-1',
      );

      // Trainee project has members with 'Trainee Project - Lead' role
      const appWithLead = createApp({
        id: 'user-trainee',
        teams: [],
      } as unknown as { teams: { id: string }[] });

      const response = await supertest(appWithLead)
        .post('/project/trainee-1/milestones')
        .send(milestoneBody);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 'milestone-1' });
      expect(projectControllerMock.createMilestone).toHaveBeenCalledWith(
        'trainee-1',
        milestoneBody,
      );
    });

    it('returns 401 without auth', async () => {
      const appNoAuth = createApp();

      const response = await supertest(appNoAuth)
        .post('/project/discovery-1/milestones')
        .send(milestoneBody);

      expect(response.status).toBe(401);
      expect(projectControllerMock.createMilestone).not.toHaveBeenCalled();
    });

    it('returns 403 for non-lead users', async () => {
      const project = getExpectedTraineeProject();
      projectControllerMock.fetchById.mockResolvedValueOnce(project);

      // user-trainer has 'Trainee Project - Mentor' role, not a lead role
      const appNonLead = createApp({
        id: 'user-trainer',
        teams: [],
      } as unknown as { teams: { id: string }[] });

      const response = await supertest(appNonLead)
        .post('/project/trainee-1/milestones')
        .send(milestoneBody);

      expect(response.status).toBe(403);
      expect(projectControllerMock.createMilestone).not.toHaveBeenCalled();
    });

    it('validates request body', async () => {
      const response = await supertest(app)
        .post('/project/discovery-1/milestones')
        .send({ description: 'Missing required fields' });

      expect(response.status).toBe(400);
      expect(projectControllerMock.createMilestone).not.toHaveBeenCalled();
    });

    it('for discovery projects checks team roles', async () => {
      const project = getExpectedDiscoveryProject(); // teamId: 'team-1'
      projectControllerMock.fetchById.mockResolvedValueOnce(project);
      projectControllerMock.createMilestone.mockResolvedValueOnce(
        'milestone-2',
      );

      // Discovery projects use team membership; 'Project Manager' is in milestoneDiscoveryTeamRoles
      const appWithDiscoveryLead = createApp({
        id: 'user-discovery-lead',
        teams: [{ id: 'team-1', role: 'Project Manager' }],
      } as unknown as { teams: { id: string }[] });

      const response = await supertest(appWithDiscoveryLead)
        .post('/project/discovery-1/milestones')
        .send(milestoneBody);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 'milestone-2' });
    });
  });
});
