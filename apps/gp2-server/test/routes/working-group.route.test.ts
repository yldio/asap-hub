import { gp2 } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { getUserResponse } from '../fixtures/user.fixtures';
import {
  getListWorkingGroupsResponse,
  getWorkingGroupResponse,
} from '../fixtures/working-group.fixtures';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import { workingGroupControllerMock } from '../mocks/working-group-controller.mock';

describe('/working-groups/ route', () => {
  const app = appFactory({
    workingGroupController: workingGroupControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  afterEach(jest.resetAllMocks);

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
      const { appWithUser, loggedInUserId } = getApp();
      await supertest(appWithUser).get('/working-groups');

      expect(workingGroupControllerMock.fetch).toBeCalledWith(loggedInUserId);
    });
  });
  describe('GET /working-group/{working_group_id}', () => {
    test('Should return 404 when working group doesnt exist', async () => {
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

      const { appWithUser, loggedInUserId } = getApp();
      await supertest(appWithUser).get(`/working-group/${workingGroupId}`);

      expect(workingGroupControllerMock.fetchById).toBeCalledWith(
        workingGroupId,
        loggedInUserId,
      );
    });
  });
  describe('PUT /working-group/{working_group_id}/resources', () => {
    test('Should return the results correctly', async () => {
      const { appWithUser } = getApp({ role: 'Administrator' });
      workingGroupControllerMock.update.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );

      const resources: gp2.Resource[] = [{ title: 'a resource', type: 'Note' }];
      const response = await supertest(appWithUser)
        .put('/working-group/23/resources')
        .send(resources);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getWorkingGroupResponse());
      expect(workingGroupControllerMock.update).toBeCalledWith(
        '23',
        { resources },
        '11',
      );
    });

    test('Should return 404 when working group doesnt exist', async () => {
      const { appWithUser } = getApp({ role: 'Administrator' });
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );
      workingGroupControllerMock.update.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(appWithUser)
        .put('/working-group/123/resources')
        .send([]);

      expect(response.status).toBe(404);
    });

    test.each(gp2.userRoles.filter((role) => role !== 'Administrator'))(
      'Should return 403 if the user is not in the Administrator role - %s',
      async (role) => {
        const { appWithUser } = getApp({ role });
        workingGroupControllerMock.update.mockResolvedValueOnce(
          getWorkingGroupResponse(),
        );
        workingGroupControllerMock.fetchById.mockResolvedValueOnce(
          getWorkingGroupResponse(),
        );

        const response = await supertest(appWithUser)
          .put('/working-group/23/resources')
          .send([]);

        expect(response.status).toBe(403);
        expect(workingGroupControllerMock.update).not.toBeCalledWith();
      },
    );
    test('Should return 403 if the user is not in part of the working group', async () => {
      const { appWithUser } = getApp({ role: 'Administrator' });
      workingGroupControllerMock.update.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );
      workingGroupControllerMock.fetchById.mockResolvedValueOnce({
        ...getWorkingGroupResponse(),
        members: [],
      });

      const response = await supertest(appWithUser)
        .put('/working-group/23/resources')
        .send([]);

      expect(response.status).toBe(403);
      expect(workingGroupControllerMock.update).not.toBeCalledWith();
    });
  });
});
const getApp = ({ role }: { role?: gp2.UserResponse['role'] } = {}) => {
  const loggedInUserId = '11';
  const loggedUser: gp2.UserResponse = {
    ...getUserResponse(),
    id: loggedInUserId,
    ...(role && { role }),
  };
  const getLoggedUser = jest.fn().mockReturnValue(loggedUser);
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = getLoggedUser();
    next();
  };
  const appWithUser = appFactory({
    workingGroupController: workingGroupControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });
  return { appWithUser, loggedInUserId };
};
