import 'express-async-errors';
import express from 'express';
import supertest from 'supertest';
import AimController from '../../src/controllers/aim.controller';
import { aimRouteFactory } from '../../src/routes/aim.route';

const aimControllerMock = {
  fetchArticles: jest.fn(),
} as unknown as jest.Mocked<AimController>;

const app = express();
app.use(express.json());
app.use(aimRouteFactory(aimControllerMock));

afterEach(() => {
  jest.resetAllMocks();
});

describe('GET /aims/:aimId/articles', () => {
  it('returns 200 with articles from the controller', async () => {
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
    aimControllerMock.fetchArticles.mockResolvedValueOnce([]);

    const response = await supertest(app).get('/aims/aim-empty/articles');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
