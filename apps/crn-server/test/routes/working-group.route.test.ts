import { createWorkingGroupListResponse } from '@asap-hub/fixtures';
import { FetchOptions } from '@asap-hub/model';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getWorkingGroupResponse } from '../fixtures/working-groups.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { workingGroupControllerMock } from '../mocks/working-group.controller.mock';

describe('/working-groups/ route', () => {
  const app = appFactory({
    workingGroupController: workingGroupControllerMock,
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

  describe('GET /working-groups/', () => {
    test('Should return 200 when there are no working groups', async () => {
      workingGroupControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(app).get('/working-groups/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      workingGroupControllerMock.fetch.mockResolvedValueOnce(
        createWorkingGroupListResponse(2),
      );

      const response = await supertest(app).get('/working-groups/');

      expect(response.body).toEqual(createWorkingGroupListResponse(2));
    });

    test('Should call the controller with the right parameters', async () => {
      workingGroupControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      await supertest(app).get('/working-groups/').query({
        take: 15,
        skip: 5,
        search: 'something',
      });

      const expectedParams: FetchOptions = {
        take: 15,
        skip: 5,
        search: 'something',
      };

      expect(workingGroupControllerMock.fetch).toBeCalledWith(expectedParams);
    });
  });
});
