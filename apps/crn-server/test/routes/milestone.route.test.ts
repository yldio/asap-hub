import { NotFoundError } from '@asap-hub/errors';
import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import MilestoneController from '../../src/controllers/milestone.controller';
import { loggerMock } from '../mocks/logger.mock';
import { getExpectedDiscoveryProject } from '../fixtures/projects.fixtures';
import { projectControllerMock } from '../mocks/project.controller.mock';

const milestoneControllerMock = {
  fetchArticles: jest.fn(),
  fetchById: jest.fn(),
  updateArticles: jest.fn(),
} as unknown as jest.Mocked<MilestoneController>;

describe('GET /milestones/:milestoneId/articles', () => {
  const userMockFactory = jest.fn<UserResponse | undefined, []>();
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = userMockFactory();
    next();
  };

  const app = appFactory({
    milestoneController: milestoneControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns 403 when loggedInUser is not set', async () => {
    userMockFactory.mockReturnValueOnce(undefined);

    const response = await supertest(app).get(
      '/milestones/milestone-123/articles',
    );

    expect(response.status).toBe(403);
    expect(milestoneControllerMock.fetchArticles).not.toHaveBeenCalled();
  });

  it('returns 200 with articles from the controller', async () => {
    userMockFactory.mockReturnValueOnce(createUserResponse());
    const mockArticles = [
      { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      { id: 'ro-2', title: 'Article Two', href: '/shared-research/ro-2' },
    ];
    milestoneControllerMock.fetchArticles.mockResolvedValueOnce(mockArticles);

    const response = await supertest(app).get(
      '/milestones/milestone-123/articles',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockArticles);
    expect(milestoneControllerMock.fetchArticles).toHaveBeenCalledWith(
      'milestone-123',
    );
  });

  it('returns 200 with empty array when no articles', async () => {
    userMockFactory.mockReturnValueOnce(createUserResponse());
    milestoneControllerMock.fetchArticles.mockResolvedValueOnce([]);

    const response = await supertest(app).get(
      '/milestones/milestone-empty/articles',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe('PUT /milestones/:milestoneId/articles', () => {
  const project = getExpectedDiscoveryProject();
  const projectTeamId = project.teamId!;

  const makeUser = (role: string): UserResponse => ({
    ...createUserResponse(),
    teams: [
      {
        id: projectTeamId,
        role: role as UserResponse['teams'][0]['role'],
        displayName: 'Team',
      },
    ],
  });

  const makeApp = (user: UserResponse | undefined) => {
    const authHandlerMock: AuthHandler = (req, _res, next) => {
      req.loggedInUser = user;
      next();
    };
    return appFactory({
      milestoneController: milestoneControllerMock,
      projectController: projectControllerMock,
      authHandler: authHandlerMock,
      logger: loggerMock,
    });
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns 403 when loggedInUser is not set', async () => {
    const app = makeApp(undefined);

    const response = await supertest(app)
      .put('/milestones/milestone-1/articles')
      .send({ articleIds: ['ro-1'] });

    expect(response.status).toBe(403);
    expect(milestoneControllerMock.updateArticles).not.toHaveBeenCalled();
  });

  it('returns 403 when user is not a project lead', async () => {
    const app = makeApp(makeUser('Key Personnel'));

    milestoneControllerMock.fetchById.mockResolvedValueOnce({
      projectId: project.id,
    });
    projectControllerMock.fetchById.mockResolvedValueOnce(project);

    const response = await supertest(app)
      .put('/milestones/milestone-1/articles')
      .send({ articleIds: ['ro-1'] });

    expect(response.status).toBe(403);
    expect(milestoneControllerMock.updateArticles).not.toHaveBeenCalled();
  });

  it('returns 200 and updates articles when user is a project lead', async () => {
    const app = makeApp(makeUser('Project Manager'));

    milestoneControllerMock.fetchById.mockResolvedValueOnce({
      projectId: project.id,
    });
    projectControllerMock.fetchById.mockResolvedValueOnce(project);
    milestoneControllerMock.updateArticles.mockResolvedValueOnce(undefined);

    const response = await supertest(app)
      .put('/milestones/milestone-1/articles')
      .send({ articleIds: ['ro-1', 'ro-2'] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(milestoneControllerMock.fetchById).toHaveBeenCalledWith(
      'milestone-1',
    );
    expect(projectControllerMock.fetchById).toHaveBeenCalledWith(project.id);
    expect(milestoneControllerMock.updateArticles).toHaveBeenCalledWith(
      'milestone-1',
      ['ro-1', 'ro-2'],
    );
  });

  it('returns 400 when body is missing articleIds', async () => {
    const app = makeApp(makeUser('Project Manager'));

    const response = await supertest(app)
      .put('/milestones/milestone-1/articles')
      .send({});

    expect(response.status).toBe(400);
    expect(milestoneControllerMock.updateArticles).not.toHaveBeenCalled();
  });

  it('returns 404 when milestone has no linked project', async () => {
    const app = makeApp(makeUser('Project Manager'));

    milestoneControllerMock.fetchById.mockRejectedValueOnce(
      new NotFoundError(
        undefined,
        'Project for milestone milestone-1 not found',
      ),
    );

    const response = await supertest(app)
      .put('/milestones/milestone-1/articles')
      .send({ articleIds: ['ro-1'] });

    expect(response.status).toBe(404);
    expect(milestoneControllerMock.updateArticles).not.toHaveBeenCalled();
  });
});
