import { gp2 } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import {
  getListProjectsResponse,
  getProjectResponse,
} from '../fixtures/project.fixtures';
import { getUserResponse } from '../fixtures/user.fixtures';
import { loggerMock } from '../mocks/logger.mock';
import { projectControllerMock } from '../mocks/project-controller.mock';

describe('/projects/ route', () => {
  afterEach(jest.resetAllMocks);

  describe('GET /projects', () => {
    test('Should return 200 when no projects are found', async () => {
      const { app } = getApp();
      projectControllerMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const { status, body } = await supertest(app).get('/projects');

      expect(status).toBe(200);
      expect(body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const { app } = getApp();
      projectControllerMock.fetch.mockResolvedValueOnce(
        getListProjectsResponse(),
      );

      const { status, body } = await supertest(app).get('/projects');

      expect(status).toBe(200);
      expect(body).toEqual(getListProjectsResponse());
    });

    test('Should call the controller fetch method', async () => {
      const { app, loggedInUserId } = getApp();
      await supertest(app).get('/projects');

      expect(projectControllerMock.fetch).toBeCalledWith(loggedInUserId);
    });
  });
  describe('GET /project/{project_id}', () => {
    test('Should return 404 when project doesnt exist', async () => {
      const { app } = getApp();
      projectControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const { status } = await supertest(app).get('/project/123');

      expect(status).toBe(404);
    });

    test('Should return the results correctly', async () => {
      const { app } = getApp();
      projectControllerMock.fetchById.mockResolvedValueOnce(
        getProjectResponse(),
      );

      const { status, body } = await supertest(app).get('/project/123');

      expect(status).toBe(200);
      expect(body).toEqual(getProjectResponse());
    });

    test('Should call the controller with the right parameter', async () => {
      const projectId = 'abc123';
      const { app, loggedInUserId } = getApp();
      await supertest(app).get(`/project/${projectId}`);

      expect(projectControllerMock.fetchById).toBeCalledWith(
        projectId,
        loggedInUserId,
      );
    });
  });
  describe('PUT /project/{project_id}/resources', () => {
    test('Should return the results correctly', async () => {
      const { app } = getApp({ role: 'Administrator' });
      projectControllerMock.update.mockResolvedValueOnce(getProjectResponse());
      projectControllerMock.fetchById.mockResolvedValueOnce(
        getProjectResponse(),
      );

      const resources: gp2.Resource[] = [{ title: 'a resource', type: 'Note' }];
      const response = await supertest(app)
        .put('/project/23/resources')
        .send(resources);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(getProjectResponse());
      expect(projectControllerMock.update).toBeCalledWith(
        '23',
        { resources },
        '11',
      );
    });

    test('Should return 404 when project doesnt exist', async () => {
      const { app } = getApp({ role: 'Administrator' });
      projectControllerMock.fetchById.mockResolvedValueOnce(
        getProjectResponse(),
      );
      projectControllerMock.update.mockRejectedValueOnce(Boom.notFound());

      const { status } = await supertest(app)
        .put('/project/123/resources')
        .send([]);

      expect(status).toBe(404);
    });

    test.each(gp2.userRoles.filter((role) => role !== 'Administrator'))(
      'Should return 403 if the user is not in the Administrator role - %s',
      async (role) => {
        const { app } = getApp({ role });
        projectControllerMock.update.mockResolvedValueOnce(
          getProjectResponse(),
        );
        projectControllerMock.fetchById.mockResolvedValueOnce(
          getProjectResponse(),
        );

        const { status } = await supertest(app)
          .put('/project/23/resources')
          .send([]);

        expect(status).toBe(403);
        expect(projectControllerMock.update).not.toBeCalledWith();
      },
    );
    test('Should return 403 if the user is not in part of the project', async () => {
      const { app } = getApp({ role: 'Administrator' });
      projectControllerMock.update.mockResolvedValueOnce(getProjectResponse());
      projectControllerMock.fetchById.mockResolvedValueOnce({
        ...getProjectResponse(),
        members: [],
      });

      const { status } = await supertest(app)
        .put('/project/23/resources')
        .send([]);

      expect(status).toBe(403);
      expect(projectControllerMock.update).not.toBeCalledWith();
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
        projectControllerMock.update.mockResolvedValueOnce(
          getProjectResponse(),
        );
        projectControllerMock.fetchById.mockResolvedValueOnce(
          getProjectResponse(),
        );

        const resources: gp2.Resource[] = [resource];
        const response = await supertest(app)
          .put('/project/23/resources')
          .send(resources);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(getProjectResponse());
        expect(projectControllerMock.update).toBeCalledWith(
          '23',
          { resources },
          '11',
        );
      });
      test('description is optional', async () => {
        const resource = getFixture();
        resource.description = undefined;

        const { app } = getApp({ role: 'Administrator' });
        projectControllerMock.update.mockResolvedValueOnce(
          getProjectResponse(),
        );
        projectControllerMock.fetchById.mockResolvedValueOnce(
          getProjectResponse(),
        );

        const resources: gp2.Resource[] = [resource];
        const response = await supertest(app)
          .put('/project/23/resources')
          .send(resources);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(getProjectResponse());
        expect(projectControllerMock.update).toBeCalledWith(
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
      projectControllerMock.update.mockResolvedValueOnce(getProjectResponse());
      projectControllerMock.fetchById.mockResolvedValueOnce(
        getProjectResponse(),
      );

      const response = await supertest(app)
        .put('/project/23/resources')
        .send([]);

      expect(response.status).toBe(200);
    });

    test('should throw when undefined', async () => {
      const { app } = getApp({ role: 'Administrator' });
      const response = await supertest(app)
        .put('/project/23/resources')
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
    projectController: projectControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });
  return { app, loggedInUserId };
};
const expectInvalid = async (resource: gp2.Resource) => {
  const { app } = getApp({ role: 'Administrator' });

  const resources: gp2.Resource[] = [resource];
  const response = await supertest(app)
    .put('/project/23/resources')
    .send(resources);
  return expect(response.status).toBe(400);
};
