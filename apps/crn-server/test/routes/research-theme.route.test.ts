import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { researchThemeControllerMock } from '../mocks/research-theme.controller.mock';

describe('/research-themes/ route', () => {
  const app = appFactory({
    authHandler: authHandlerMock,
    researchThemeController: researchThemeControllerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /research-themes', () => {
    test('Should return 200 when no research themes exist', async () => {
      researchThemeControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/research-themes');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listResearchThemeResponse = {
        total: 2,
        items: [
          { id: 'theme-1', name: 'Neurodegeneration' },
          { id: 'theme-2', name: 'Cell Biology' },
        ],
      };

      researchThemeControllerMock.fetch.mockResolvedValueOnce(
        listResearchThemeResponse,
      );

      const response = await supertest(app).get('/research-themes');

      expect(response.body).toEqual(listResearchThemeResponse);
    });

    test('Should call the controller fetch method', async () => {
      await supertest(app).get('/research-themes');

      expect(researchThemeControllerMock.fetch).toHaveBeenCalledWith({});
    });
  });
});
