import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { resourceTypeControllerMock } from '../mocks/resource-type.controller.mock';

describe('/resource-types/ route', () => {
  const app = appFactory({
    authHandler: authHandlerMock,
    resourceTypeController: resourceTypeControllerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /resource-types', () => {
    test('Should return 200 when no resource types exist', async () => {
      resourceTypeControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/resource-types');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listResourceTypeResponse = {
        total: 2,
        items: [
          { id: 'type-1', name: 'Database' },
          { id: 'type-2', name: 'Data Portal' },
        ],
      };

      resourceTypeControllerMock.fetch.mockResolvedValueOnce(
        listResourceTypeResponse,
      );

      const response = await supertest(app).get('/resource-types');

      expect(response.body).toEqual(listResourceTypeResponse);
    });

    test('Should call the controller fetch method', async () => {
      await supertest(app).get('/resource-types');

      expect(resourceTypeControllerMock.fetch).toHaveBeenCalled();
    });
  });
});
