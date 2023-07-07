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
import { loggerMock } from '../mocks/logger.mock';
import { workingGroupControllerMock } from '../mocks/working-group.controller.mock';

describe('/working-groups/ route', () => {
  afterEach(jest.resetAllMocks);

  describe('GET /working-groups', () => {
    test('Should return 200 when no working groups are found', async () => {
      const { app } = getApp();
      workingGroupControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const { status, body } = await supertest(app).get('/working-groups');

      expect(status).toBe(200);
      expect(body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const { app } = getApp();
      workingGroupControllerMock.fetch.mockResolvedValueOnce(
        getListWorkingGroupsResponse(),
      );

      const { status, body } = await supertest(app).get('/working-groups');

      expect(status).toBe(200);
      expect(body).toEqual(getListWorkingGroupsResponse());
    });

    test('Should call the controller fetch method', async () => {
      const { app, loggedInUserId } = getApp();
      await supertest(app).get('/working-groups');

      expect(workingGroupControllerMock.fetch).toBeCalledWith(loggedInUserId);
    });
  });
  describe('GET /working-group/{working_group_id}', () => {
    test('Should return 404 when working group doesnt exist', async () => {
      const { app } = getApp();
      workingGroupControllerMock.fetchById.mockRejectedValueOnce(
        Boom.notFound(),
      );

      const { status } = await supertest(app).get('/working-group/123');

      expect(status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      const { app } = getApp();
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );

      const { status, body } = await supertest(app).get('/working-group/123');

      expect(status).toBe(200);
      expect(body).toEqual(getWorkingGroupResponse());
    });

    test('Should call the controller with the right parameter', async () => {
      const workingGroupId = 'abc123';

      const { app, loggedInUserId } = getApp();
      await supertest(app).get(`/working-group/${workingGroupId}`);

      expect(workingGroupControllerMock.fetchById).toBeCalledWith(
        workingGroupId,
        loggedInUserId,
      );
    });
  });
  describe('PUT /working-group/{working_group_id}/resources', () => {
    test('Should return the results correctly', async () => {
      const { app } = getApp({ role: 'Administrator' });
      workingGroupControllerMock.update.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );

      const resources: gp2.Resource[] = [{ title: 'a resource', type: 'Note' }];
      const response = await supertest(app)
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
      const { app } = getApp({ role: 'Administrator' });
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );
      workingGroupControllerMock.update.mockRejectedValueOnce(Boom.notFound());

      const { status } = await supertest(app)
        .put('/working-group/123/resources')
        .send([]);

      expect(status).toBe(404);
    });

    test.each(gp2.userRoles.filter((role) => role !== 'Administrator'))(
      'Should return 403 if the user is not in the Administrator role - %s',
      async (role) => {
        const { app } = getApp({ role });
        workingGroupControllerMock.update.mockResolvedValueOnce(
          getWorkingGroupResponse(),
        );
        workingGroupControllerMock.fetchById.mockResolvedValueOnce(
          getWorkingGroupResponse(),
        );

        const { status } = await supertest(app)
          .put('/working-group/23/resources')
          .send([]);

        expect(status).toBe(403);
        expect(workingGroupControllerMock.update).not.toBeCalledWith();
      },
    );
    test('Should return 403 if the user is not in part of the working group', async () => {
      const { app } = getApp({ role: 'Administrator' });
      workingGroupControllerMock.update.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );
      workingGroupControllerMock.fetchById.mockResolvedValueOnce({
        ...getWorkingGroupResponse(),
        members: [],
      });

      const { status } = await supertest(app)
        .put('/working-group/23/resources')
        .send([]);

      expect(status).toBe(403);
      expect(workingGroupControllerMock.update).not.toBeCalledWith();
    });
    const getLink = (): gp2.ResourceLink => ({
      type: 'Link' as const,
      title: 'a title',
      description: 'some description',
      externalLink: 'http://example.com',
    });
    const getNote = (): gp2.ResourceNote => ({
      type: 'Note',
      title: 'a title',
      description: 'some description',
    });
    describe.each`
      type      | getFixture
      ${'Note'} | ${getNote}
      ${'Link'} | ${getLink}
    `('Resource of $type', ({ getFixture }) => {
      test('validates', async () => {
        const resource = getFixture();
        const { app } = getApp({ role: 'Administrator' });
        workingGroupControllerMock.update.mockResolvedValueOnce(
          getWorkingGroupResponse(),
        );
        workingGroupControllerMock.fetchById.mockResolvedValueOnce(
          getWorkingGroupResponse(),
        );

        const resources: gp2.Resource[] = [resource];
        const response = await supertest(app)
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
      test('description is optional', async () => {
        const resource = getFixture();
        resource.description = undefined;

        const { app } = getApp({ role: 'Administrator' });
        workingGroupControllerMock.update.mockResolvedValueOnce(
          getWorkingGroupResponse(),
        );
        workingGroupControllerMock.fetchById.mockResolvedValueOnce(
          getWorkingGroupResponse(),
        );

        const resources: gp2.Resource[] = [resource];
        const response = await supertest(app)
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
      test('title is required', async () => {
        const resource = getFixture();
        resource.title = undefined;

        return expectInvalid(resource);
      });
    });
    test('externalLink is required on Link', async () => {
      const resource = getLink();

      // @ts-ignore
      resource.externalLink = undefined;

      return expectInvalid(resource);
    });

    test('externalLink is a valid url on Link', async () => {
      const resource = getLink();

      resource.externalLink = 'some-string';
      return expectInvalid(resource);
    });

    test('externalLink is not allowed on a Note', async () => {
      const resource = getNote();

      // @ts-ignore
      resource.externalLink = 'http://example.com';
      return expectInvalid(resource);
    });

    test.each(['invalid-type', 'Note2'])(
      'should not allow random types %s',
      async (type) => {
        const resource = getNote();
        // @ts-ignore
        resource.type = type;

        return expectInvalid(resource);
      },
    );

    test('should not allow random types Link2', async () => {
      const resource = getLink();
      // @ts-ignore
      resource.type = 'Link2';

      return expectInvalid(resource);
    });

    test('should allow an empty array', async () => {
      const { app } = getApp({ role: 'Administrator' });
      workingGroupControllerMock.update.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );
      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        getWorkingGroupResponse(),
      );

      const response = await supertest(app)
        .put('/working-group/23/resources')
        .send([]);

      expect(response.status).toBe(200);
    });

    test('should throw when undefined', async () => {
      const { app } = getApp({ role: 'Administrator' });
      const response = await supertest(app)
        .put('/working-group/23/resources')
        .send(undefined);
      expect(response.status).toBe(400);
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
  const app = appFactory({
    workingGroupController: workingGroupControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });
  return { app, loggedInUserId };
};
const expectInvalid = async (resource: gp2.Resource) => {
  const { app } = getApp({ role: 'Administrator' });

  const resources: gp2.Resource[] = [resource];
  const response = await supertest(app)
    .put('/working-group/23/resources')
    .send(resources);
  return expect(response.status).toBe(400);
};
