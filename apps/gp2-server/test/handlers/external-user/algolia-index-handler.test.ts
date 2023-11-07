import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { ExternalUserPayload } from '../../../src/handlers/event-bus';
import { indexExternalUserHandler } from '../../../src/handlers/external-user/algolia-index-handler';
import {
  getExternalUserEvent,
  getExternalUserResponse,
} from '../../fixtures/external-users.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { externalUserControllerMock } from '../../mocks/external-user.controller.mock';
import { loggerMock } from '../../mocks/logger.mock';

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
describe('External User index handler', () => {
  const indexHandler = indexExternalUserHandler(
    externalUserControllerMock,
    algoliaSearchClientMock,
    loggerMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should fetch the external user and create a record in Algolia when external user is created', async () => {
    const externalUserResponse = getExternalUserResponse();
    externalUserControllerMock.fetchById.mockResolvedValueOnce(
      externalUserResponse,
    );

    await indexHandler(createEvent('42'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(externalUserResponse),
      type: 'external-user',
    });
  });

  test('Should fetch the external user and create a record in Algolia when external user is updated', async () => {
    const externalUserResponse = getExternalUserResponse();
    externalUserControllerMock.fetchById.mockResolvedValueOnce(
      externalUserResponse,
    );

    await indexHandler(updateEvent('42'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(externalUserResponse),
      type: 'external-user',
    });
  });

  test('Should fetch the external user and remove the record in Algolia when external user is unpublished', async () => {
    const event = unpublishedEvent('42');

    externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should fetch the external user and remove the record in Algolia when external user is deleted', async () => {
    const event = deleteEvent('42');

    externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should throw an error and do not trigger algolia when the external user request fails with another error code', async () => {
    externalUserControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(createEvent('42'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    externalUserControllerMock.fetchById.mockResolvedValueOnce(
      getExternalUserResponse(),
    );
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(updateEvent('42'))).rejects.toThrow(algoliaError);
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(deleteEvent('42'))).rejects.toThrow(algoliaError);
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events created and updated in correct order', async () => {
      const id = '42';
      const externalUserResponse = {
        ...getExternalUserResponse(),
        id,
      };

      externalUserControllerMock.fetchById.mockResolvedValue({
        ...externalUserResponse,
      });

      await indexHandler(createEvent(id));
      await indexHandler(updateEvent(id));

      expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
        data: expect.objectContaining(externalUserResponse),
        type: 'external-user',
      });
    });

    test('receives the events created and updated in reverse order', async () => {
      const id = '42';
      const externalUserResponse = {
        ...getExternalUserResponse(),
        id,
      };

      externalUserControllerMock.fetchById.mockResolvedValue(
        externalUserResponse,
      );

      await indexHandler(updateEvent(id));
      await indexHandler(createEvent(id));

      expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
        data: expect.objectContaining(externalUserResponse),
        type: 'external-user',
      });
    });

    test('receives the events created and unpublished in correct order', async () => {
      const id = '42';
      const createEv = createEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });

    test('receives the events created and unpublished in reverse order', async () => {
      const id = '42';
      const createEv = createEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });

    test('receives the events created and deleted in correct order', async () => {
      const id = '42';
      const createEv = createEvent(id);
      const deleteEv = deleteEvent(id);
      const algoliaError = new Error('ERROR');

      externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.resourceId,
      );
    });

    test('receives the events created and deleted in reverse order', async () => {
      const id = '42';
      const createEv = createEvent(id);
      const deleteEv = deleteEvent(id);
      const algoliaError = new Error('ERROR');

      externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);
      await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.resourceId,
      );
    });

    test('receives the events updated and deleted in correct order', async () => {
      const id = '42';
      const updateEv = updateEvent(id);
      const deleteEv = deleteEvent(id);
      const algoliaError = new Error('ERROR');

      externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);
      await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.resourceId,
      );
    });

    test('receives the events updated and deleted in reverse order', async () => {
      const id = '42';
      const updateEv = updateEvent(id);
      const deleteEv = deleteEvent(id);
      const algoliaError = new Error('ERROR');

      externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);
      await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.resourceId,
      );
    });
    test('receives the events updated and unpublished in correct order', async () => {
      const id = '42';
      const updateEv = updateEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });

    test('receives the events updated and unpublished in reverse order', async () => {
      const id = '42';
      const updateEv = updateEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      externalUserControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.resourceId,
      );
    });
  });
});

const unpublishedEvent = (id: string) =>
  getExternalUserEvent(id, 'ExternalUsersUnpublished') as EventBridgeEvent<
    gp2Model.ExternalUserEvent,
    ExternalUserPayload
  >;

const deleteEvent = (id: string) =>
  getExternalUserEvent(id, 'ExternalUsersDeleted') as EventBridgeEvent<
    gp2Model.ExternalUserEvent,
    ExternalUserPayload
  >;

const createEvent = (id: string) =>
  getExternalUserEvent(id, 'ExternalUsersPublished') as EventBridgeEvent<
    gp2Model.ExternalUserEvent,
    ExternalUserPayload
  >;

const updateEvent = (id: string) =>
  getExternalUserEvent(id, 'ExternalUsersUpdated') as EventBridgeEvent<
    gp2Model.ExternalUserEvent,
    ExternalUserPayload
  >;
