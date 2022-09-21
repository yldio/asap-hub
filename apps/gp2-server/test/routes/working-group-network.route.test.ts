import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getListWorkingGroupNetworkResponse } from '../fixtures/working-group-network.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { workingGroupNetworkControllerMock } from '../mocks/working-group-network-controller.mock';

describe('/working-groups-network/ route', () => {
  const app = appFactory({
    workingGroupNetworkController: workingGroupNetworkControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /working-group-network', () => {
    test('Should return 200 when no working groups are found', async () => {
      workingGroupNetworkControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/working-group-network');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      workingGroupNetworkControllerMock.fetch.mockResolvedValueOnce(
        getListWorkingGroupNetworkResponse(),
      );

      const response = await supertest(app).get('/working-group-network');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListWorkingGroupNetworkResponse());
    });

    test('Should call the controller fetch method', async () => {
      await supertest(app).get('/working-group-network');

      expect(workingGroupNetworkControllerMock.fetch).toBeCalled();
    });
  });
});
