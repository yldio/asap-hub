import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import MilestoneController from '../../src/controllers/milestone.controller';
import { loggerMock } from '../mocks/logger.mock';

const milestoneControllerMock = {
  fetchArticles: jest.fn(),
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
