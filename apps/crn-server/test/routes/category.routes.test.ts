import supertest from 'supertest';
import { appFactory } from '../../src/app';
import CategoryController from '../../src/controllers/category.controller';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';

describe('/categories/ route', () => {
  const categoryControllerMock = {
    fetch: jest.fn(),
  } as unknown as jest.Mocked<CategoryController>;
  const app = appFactory({
    categoryController: categoryControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });
  afterEach(() => {
    categoryControllerMock.fetch.mockReset();
  });
  describe('GET /categories', () => {
    it('should return 200 when no categories exists', async () => {
      categoryControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/categories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ total: 0, items: [] });
    });

    it('should return 200 when categories exists', async () => {
      categoryControllerMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [
          {
            id: '1',
            name: 'Category 1',
          },
        ],
      });

      const response = await supertest(app).get('/categories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 1,
        items: [
          {
            id: '1',
            name: 'Category 1',
          },
        ],
      });
    });

    describe('Parameter validation', () => {
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(app).get(`/categories`).query({
          additionalField: 'some-data',
        });
        expect(response.status).toBe(400);
      });
    });
  });
});
