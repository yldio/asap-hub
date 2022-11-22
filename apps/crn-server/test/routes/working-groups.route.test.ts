import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getWorkingGroupResponse } from '../fixtures/working-groups.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { workingGroupControllerMock } from '../mocks/working-group-controller.mock';

describe('/working-groups/ route', () => {
  const app = appFactory({
    workingGroupsController: workingGroupControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /working-groups/{groupId}', () => {
    test('Should return 404 when no working-group exist', async () => {
      workingGroupControllerMock.fetchById.mockRejectedValueOnce(
        Boom.notFound(),
      );

      const response = await supertest(app).get('/working-groups/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );

      const response = await supertest(app).get('/working-groups/123');

      expect(response.body).toEqual(getWorkingGroupResponse());
    });
  });
});
