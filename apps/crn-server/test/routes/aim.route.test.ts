import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import AimController from '../../src/controllers/aim.controller';
import { loggerMock } from '../mocks/logger.mock';

const aimControllerMock = {
  fetchArticles: jest.fn(),
} as unknown as jest.Mocked<AimController>;

describe('GET /aims/:aimId/articles', () => {
  const userMockFactory = jest.fn<UserResponse | undefined, []>();
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = userMockFactory();
    next();
  };

  const app = appFactory({
    aimController: aimControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns 403 when loggedInUser is not set', async () => {
    userMockFactory.mockReturnValueOnce(undefined);

    const response = await supertest(app).get('/aims/aim-123/articles');

    expect(response.status).toBe(403);
    expect(aimControllerMock.fetchArticles).not.toHaveBeenCalled();
  });

  it('returns 200 with articles from the controller', async () => {
    userMockFactory.mockReturnValueOnce(createUserResponse());
    const mockArticles = [
      { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
      { id: 'ro-2', title: 'Article Two', href: '/shared-research/ro-2' },
    ];
    aimControllerMock.fetchArticles.mockResolvedValueOnce(mockArticles);

    const response = await supertest(app).get('/aims/aim-123/articles');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockArticles);
    expect(aimControllerMock.fetchArticles).toHaveBeenCalledWith('aim-123');
  });

  it('returns 200 with empty array when no articles', async () => {
    userMockFactory.mockReturnValueOnce(createUserResponse());
    aimControllerMock.fetchArticles.mockResolvedValueOnce([]);

    const response = await supertest(app).get('/aims/aim-empty/articles');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
