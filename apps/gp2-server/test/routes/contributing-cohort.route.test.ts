import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getListContributingCohortResponse } from '../fixtures/contributing-cohort.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { contributingCohortControllerMock } from '../mocks/contributing-cohort.controller.mock';

describe('/contributingCohort/ route', () => {
  const app = appFactory({
    contributingCohortController: contributingCohortControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(jest.resetAllMocks);

  describe('GET /contributing-cohorts', () => {
    test('Should return 200 when no contributingCohort exists', async () => {
      contributingCohortControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/contributing-cohorts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      contributingCohortControllerMock.fetch.mockResolvedValueOnce(
        getListContributingCohortResponse(),
      );

      const response = await supertest(app).get('/contributing-cohorts');

      expect(contributingCohortControllerMock.fetch).toBeCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListContributingCohortResponse());
    });
  });
});
