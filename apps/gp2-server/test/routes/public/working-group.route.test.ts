import { NotFoundError } from '@asap-hub/errors';
import supertest from 'supertest';
import { publicAppFactory } from '../../../src/publicApp';
import {
  getListPublicWorkingGroupResponse,
  getListWorkingGroupsResponse,
  getPublicWorkingGroupResponse,
  getWorkingGroupResponse,
} from '../../fixtures/working-group.fixtures';
import { workingGroupControllerMock } from '../../mocks/working-group.controller.mock';

describe('/working-groups/ route', () => {
  const publicApp = publicAppFactory({
    workingGroupController: workingGroupControllerMock,
    cacheMiddleware: (_req, _res, next) => next(),
  });

  afterEach(jest.clearAllMocks);

  describe('GET /working-groups', () => {
    test('Should return 200 when no working-group exists', async () => {
      workingGroupControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });
      const response = await supertest(publicApp).get('/public/working-groups');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listWorkingGroupResponse = getListWorkingGroupsResponse();
      const listPublicWorkingGroupResponse =
        getListPublicWorkingGroupResponse();

      workingGroupControllerMock.fetch.mockResolvedValueOnce(
        listWorkingGroupResponse,
      );

      const response = await supertest(publicApp).get('/public/working-groups');

      expect(response.body).toEqual(listPublicWorkingGroupResponse);
    });
  });

  describe('GET /working-groups/:workingGroupId', () => {
    test('Should return 404 when working-group does not exist', async () => {
      workingGroupControllerMock.fetchById.mockRejectedValueOnce(
        new NotFoundError(undefined, 'working-group with id not found'),
      );

      const response = await supertest(publicApp).get(
        '/public/working-groups/working-group-id',
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'working-group with id not found',
        statusCode: 404,
      });
    });

    test('Should return the working-group correctly', async () => {
      const workingGroupResponse = getWorkingGroupResponse();
      const publicWorkingGroupResponse = getPublicWorkingGroupResponse();

      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        workingGroupResponse,
      );

      const response = await supertest(publicApp).get(
        `/public/working-groups/${workingGroupResponse!.id}`,
      );

      expect(response.body).toEqual(publicWorkingGroupResponse);
    });
  });
});
