import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import {
  getListWorkingGroupsResponse,
  getWorkingGroupResponse,
} from '../fixtures/working-group.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { workingGroupControllerMock } from '../mocks/working-group-controller.mock';

describe('/working-groups/ route', () => {
  const app = appFactory({
    workingGroupController: workingGroupControllerMock,
    authHandler: authHandlerMock,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /working-groups', () => {
    test('Should return 200 when no working groups are found', async () => {
      workingGroupControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const response = await supertest(app).get('/working-groups');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      workingGroupControllerMock.fetch.mockResolvedValueOnce(
        getListWorkingGroupsResponse(),
      );

      const response = await supertest(app).get('/working-groups');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getListWorkingGroupsResponse());
    });

    test('Should call the controller fetch method', async () => {
      await supertest(app).get('/working-groups');

      expect(workingGroupControllerMock.fetch).toBeCalled();
    });
  });
  describe('GET /working-group/{working_group_id}', () => {
    test('Should return 404 when user doesnt exist', async () => {
      workingGroupControllerMock.fetchById.mockRejectedValueOnce(
        Boom.notFound(),
      );

      const response = await supertest(app).get('/working-group/123');

      expect(response.status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );

      const response = await supertest(app).get('/working-group/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getWorkingGroupResponse());
    });

    test('Should call the controller with the right parameter', async () => {
      const workingGroupId = 'abc123';

      await supertest(app).get(`/working-group/${workingGroupId}`);

      expect(workingGroupControllerMock.fetchById).toBeCalledWith(
        workingGroupId,
      );
    });
  });
});
