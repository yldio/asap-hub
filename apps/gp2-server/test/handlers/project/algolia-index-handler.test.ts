import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { ProjectPayload } from '../../../src/handlers/event-bus';
import { indexProjectHandler } from '../../../src/handlers/project/algolia-index-handler';
import {
  getProjectEvent,
  getProjectResponse,
} from '../../fixtures/project.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { loggerMock } from '../../mocks/logger.mock';
import { projectControllerMock } from '../../mocks/project.controller.mock';

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
describe('Project index handler', () => {
  const indexHandler = indexProjectHandler(
    projectControllerMock,
    algoliaSearchClientMock,
    loggerMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should fetch the project and create a record in Algolia when project is published', async () => {
    const projectResponse = getProjectResponse();
    projectControllerMock.fetchById.mockResolvedValueOnce(projectResponse);

    await indexHandler(publishedEvent('42'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(projectResponse),
      type: 'project',
    });
  });

  test('Should populate the _tags field before saving the project to Algolia', async () => {
    const projectResponse = getProjectResponse();
    projectResponse.tags = [{ id: '1', name: 'project tag' }];
    projectControllerMock.fetchById.mockResolvedValueOnce(projectResponse);

    await indexHandler(publishedEvent('42'));
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: {
        ...projectResponse,
        _tags: expect.arrayContaining(['project tag']),
      },
      type: 'project',
    });
  });

  test('Should fetch the project and remove the record in Algolia when project is unpublished', async () => {
    const event = unpublishedEvent('42');

    projectControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should throw an error and do not trigger algolia when the project request fails with another error code', async () => {
    projectControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(publishedEvent('42'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when publishing the record fails', async () => {
    const algoliaError = new Error('ERROR');

    projectControllerMock.fetchById.mockResolvedValueOnce(getProjectResponse());
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(publishedEvent('42'))).rejects.toThrow(
      algoliaError,
    );
  });

  test('Should throw the algolia error when unpublishing the record fails', async () => {
    const algoliaError = new Error('ERROR');

    projectControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(unpublishedEvent('42'))).rejects.toThrow(
      algoliaError,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events published and unpublished in correct order', async () => {
      const id = '42';
      const publishedEv = publishedEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      projectControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(publishedEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });

    test('receives the events published and unpublished in reverse order', async () => {
      const id = '42';
      const publishedEv = publishedEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      projectControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(publishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });
  });
});

const unpublishedEvent = (id: string) =>
  getProjectEvent(id, 'ProjectsUnpublished') as EventBridgeEvent<
    gp2Model.ProjectEvent,
    ProjectPayload
  >;

const publishedEvent = (id: string) =>
  getProjectEvent(id, 'ProjectsPublished') as EventBridgeEvent<
    gp2Model.ProjectEvent,
    ProjectPayload
  >;
