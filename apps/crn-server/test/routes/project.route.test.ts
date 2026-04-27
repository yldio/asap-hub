import 'express-async-errors';
import express from 'express';
import supertest from 'supertest';
import Boom from '@hapi/boom';
import { NotFoundError } from '@asap-hub/errors';
import {
  ListProjectDataObject,
  ProjectResponse,
  TeamRole,
} from '@asap-hub/model';

import { projectRouteFactory } from '../../src/routes/project.route';
import {
  getExpectedDiscoveryProject,
  getExpectedProjectList,
  getExpectedTraineeProject,
  getProjectMilestonesResponse,
} from '../fixtures/projects.fixtures';
import ProjectController from '../../src/controllers/project.controller';

const projectControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchProjectMilestones: jest.fn(),
  update: jest.fn(),
  createMilestone: jest.fn(),
  isProjectMilestonesSynced: jest.fn(),
} as unknown as jest.Mocked<ProjectController>;

const createApp = (loggedInUser?: {
  id?: string;
  teams: { id: string; role?: TeamRole }[];
}) => {
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

  describe('GET /projects/:projectId', () => {
    it('returns the project when found', async () => {
      const project = getExpectedDiscoveryProject();
      projectControllerMock.fetchById.mockResolvedValueOnce(project);

      const response = await supertest(app).get('/projects/discovery-1');

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

      const response = await supertest(app).get('/projects/missing');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /projects/:projectId/milestones', () => {
    it('returns the project milestones', async () => {
      const projectMilestones = getProjectMilestonesResponse();
      projectControllerMock.fetchProjectMilestones.mockResolvedValueOnce(
        projectMilestones,
      );

      const response = await supertest(app).get(
        '/projects/project-1/milestones',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(projectMilestones);
      expect(projectControllerMock.fetchProjectMilestones).toHaveBeenCalledWith(
        'project-1',
        {},
      );
    });

    it('returns 400 for invalid query parameters', async () => {
      const response = await supertest(app)
        .get('/projects/project-1/milestones')
        .query({ take: 'invalid' });

      expect(response.status).toBe(400);
      expect(
        projectControllerMock.fetchProjectMilestones,
      ).not.toHaveBeenCalled();
    });

    it('forwards search and filter query parameters', async () => {
      projectControllerMock.fetchProjectMilestones.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app)
        .get('/projects/project-1/milestones')
        .query({
          grantType: 'original',
          search: 'milestone description',
          filter: ['Complete', 'Pending'],
        });

      expect(response.status).toBe(200);
      expect(projectControllerMock.fetchProjectMilestones).toHaveBeenCalledWith(
        'project-1',
        {
          grantType: 'original',
          search: 'milestone description',
          filter: ['Complete', 'Pending'],
        },
      );
    });
  });

  describe('PATCH /projects/:projectId', () => {
    const tools = [{ name: 'Slack', url: 'https://slack.com' }];

    it('calls update with the project id and tools and returns the result', async () => {
      const project = getExpectedDiscoveryProject();
      const updated =
        getExpectedDiscoveryProject() as unknown as ProjectResponse;
      projectControllerMock.fetchById.mockResolvedValueOnce(project);
      projectControllerMock.update.mockResolvedValueOnce(updated);

      const response = await supertest(app)
        .patch('/projects/discovery-1')
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
        .patch('/projects/discovery-1')
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
        .patch('/projects/discovery-1')
        .send({ tools });

      expect(response.status).toBe(403);
      expect(projectControllerMock.update).not.toHaveBeenCalled();
    });

    it('returns 400 for an invalid request body', async () => {
      const response = await supertest(app)
        .patch('/projects/discovery-1')
        .send({ tools: [{ name: 'Missing URL' }] });

      expect(response.status).toBe(400);
      expect(projectControllerMock.update).not.toHaveBeenCalled();
    });

    it('maps not found errors to a 404 response', async () => {
      projectControllerMock.fetchById.mockRejectedValueOnce(
        new NotFoundError(undefined, 'project missing'),
      );

      const response = await supertest(app)
        .patch('/projects/missing')
        .send({ tools });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /projects/:projectId/milestones', () => {
    const milestonePayload = {
      grantType: 'original',
      description: 'First milestone',
      status: 'Pending',
      aimIds: ['aim-1'],
    };

    it('creates a milestone and returns the id when user is a project lead', async () => {
      const project = getExpectedDiscoveryProject();
      const milestoneId = 'milestone-123';
      const relatedTeamId = project.teamId!;

      projectControllerMock.fetchById.mockResolvedValueOnce(project);
      projectControllerMock.createMilestone.mockResolvedValueOnce(milestoneId);

      const appWithLead = createApp({
        id: 'user-id',
        teams: [{ id: relatedTeamId, role: 'Project Manager' }],
      });

      const response = await supertest(appWithLead)
        .post('/projects/discovery-1/milestones')
        .send(milestonePayload);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: milestoneId });
      expect(projectControllerMock.createMilestone).toHaveBeenCalledWith(
        'discovery-1',
        milestonePayload,
      );
    });

    it('returns 401 when user is not logged in', async () => {
      const appWithoutUser = createApp();

      const response = await supertest(appWithoutUser)
        .post('/projects/discovery-1/milestones')
        .send(milestonePayload);

      expect(response.status).toBe(401);
      expect(projectControllerMock.createMilestone).not.toHaveBeenCalled();
    });

    it('returns 403 when the user is not a project lead for team based project', async () => {
      const project = getExpectedDiscoveryProject();
      const relatedTeamId = project.teamId!;

      projectControllerMock.fetchById.mockResolvedValueOnce(project);

      const appWithNonLead = createApp({
        id: 'user-id',
        teams: [{ id: relatedTeamId, role: 'Key Personnel' }],
      });

      const response = await supertest(appWithNonLead)
        .post('/projects/discovery-1/milestones')
        .send(milestonePayload);

      expect(response.status).toBe(403);
      expect(projectControllerMock.createMilestone).not.toHaveBeenCalled();
    });

    it('returns 403 when the user is not a project lead for user based project', async () => {
      const userId = 'user-non-lead';
      const project = {
        ...getExpectedTraineeProject(),
        members: [
          {
            id: userId,
            displayName: 'Dana Lopez',
            firstName: 'Dana',
            lastName: 'Lopez',
            avatarUrl: undefined,
            role: 'Trainee Project - Key Personnel',
            email: 'dana@example.com',
            alumniSinceDate: undefined,
          },
        ],
      };

      projectControllerMock.fetchById.mockResolvedValueOnce(project);

      const appWithNonLead = createApp({
        id: userId,
        teams: [{ id: 'team-1' }],
      });

      const response = await supertest(appWithNonLead)
        .post('/projects/discovery-1/milestones')
        .send(milestonePayload);

      expect(response.status).toBe(403);
      expect(projectControllerMock.createMilestone).not.toHaveBeenCalled();
    });

    it('returns 400 for an invalid request body', async () => {
      const response = await supertest(app)
        .post('/projects/discovery-1/milestones')
        .send({ name: 'Missing due date' });

      expect(response.status).toBe(400);
      expect(projectControllerMock.createMilestone).not.toHaveBeenCalled();
    });

    it('maps not found errors to a 404 response', async () => {
      projectControllerMock.fetchById.mockRejectedValueOnce(
        new NotFoundError(undefined, 'project missing'),
      );

      const response = await supertest(app)
        .post('/projects/missing/milestones')
        .send(milestonePayload);

      expect(response.status).toBe(404);
      expect(projectControllerMock.createMilestone).not.toHaveBeenCalled();
    });
  });

  describe('GET /projects/:projectId/milestones-sync-status', () => {
    it('returns sync status from controller', async () => {
      projectControllerMock.isProjectMilestonesSynced.mockResolvedValueOnce(
        true,
      );

      const response = await supertest(app).get(
        '/projects/project-1/milestones-sync-status',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ syncComplete: true });
      expect(
        projectControllerMock.isProjectMilestonesSynced,
      ).toHaveBeenCalledWith('project-1');
    });

    it('returns 403 when user is not logged in', async () => {
      const appWithoutUser = createApp();

      const response = await supertest(appWithoutUser).get(
        '/projects/project-1/milestones-sync-status',
      );

      expect(response.status).toBe(403);
      expect(
        projectControllerMock.isProjectMilestonesSynced,
      ).not.toHaveBeenCalled();
    });

    it('handles false sync status correctly', async () => {
      projectControllerMock.isProjectMilestonesSynced.mockResolvedValueOnce(
        false,
      );

      const response = await supertest(app).get(
        '/projects/project-1/milestones-sync-status',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ syncComplete: false });
    });
  });
});
