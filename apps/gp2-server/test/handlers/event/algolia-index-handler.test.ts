import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { EventPayload } from '../../../src/handlers/event-bus';
import { indexEventHandler } from '../../../src/handlers/event/algolia-index-handler';
import { getEventEvent, getEventResponse } from '../../fixtures/event.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event.controller.mock';
import { loggerMock } from '../../mocks/logger.mock';

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
describe('Event index handler', () => {
  const indexHandler = indexEventHandler(
    eventControllerMock,
    algoliaSearchClientMock,
    loggerMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should fetch the event and create a record in Algolia when event is created', async () => {
    const eventResponse = getEventResponse();
    eventControllerMock.fetchById.mockResolvedValueOnce(eventResponse);

    await indexHandler(createEvent('42'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(eventResponse),
      type: 'event',
    });
  });

  test('Should populate the _tags field before saving the event to Algolia', async () => {
    const eventResponse = getEventResponse();
    eventResponse.tags = [{ id: '1', name: 'event tag' }];
    eventControllerMock.fetchById.mockResolvedValueOnce(eventResponse);

    await indexHandler(createEvent('42'));
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: {
        ...eventResponse,
        _tags: ['event tag'],
      },
      type: 'event',
    });
  });

  test('Should fetch the event and create a record in Algolia when event is updated', async () => {
    const eventResponse = getEventResponse();
    eventControllerMock.fetchById.mockResolvedValueOnce(eventResponse);

    await indexHandler(updateEvent('42'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(eventResponse),
      type: 'event',
    });
  });

  test('Should fetch the event and remove the record in Algolia when event is unpublished', async () => {
    const event = unpublishedEvent('42');

    eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should fetch the event and remove the record in Algolia when event is deleted', async () => {
    const event = deleteEvent('42');

    eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should throw an error and do not trigger algolia when the event request fails with another error code', async () => {
    eventControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(createEvent('42'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    eventControllerMock.fetchById.mockResolvedValueOnce(getEventResponse());
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(updateEvent('42'))).rejects.toThrow(algoliaError);
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(deleteEvent('42'))).rejects.toThrow(algoliaError);
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events created and updated in correct order', async () => {
      const id = '42';
      const eventResponse = {
        ...getEventResponse(),
        id,
      };

      eventControllerMock.fetchById.mockResolvedValue({
        ...eventResponse,
      });

      await indexHandler(createEvent(id));
      await indexHandler(updateEvent(id));

      expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
        data: expect.objectContaining(eventResponse),
        type: 'event',
      });
    });

    test('receives the events created and updated in reverse order', async () => {
      const id = '42';
      const eventResponse = {
        ...getEventResponse(),
        id,
      };

      eventControllerMock.fetchById.mockResolvedValue(eventResponse);

      await indexHandler(updateEvent(id));
      await indexHandler(createEvent(id));

      expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
        data: expect.objectContaining(eventResponse),
        type: 'event',
      });
    });

    test('receives the events created and unpublished in correct order', async () => {
      const id = '42';
      const createEv = createEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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
  getEventEvent(id, 'EventsUnpublished') as EventBridgeEvent<
    gp2Model.EventEvent,
    EventPayload
  >;

const deleteEvent = (id: string) =>
  getEventEvent(id, 'EventsDeleted') as EventBridgeEvent<
    gp2Model.EventEvent,
    EventPayload
  >;

const createEvent = (id: string) =>
  getEventEvent(id, 'EventsPublished') as EventBridgeEvent<
    gp2Model.EventEvent,
    EventPayload
  >;

const updateEvent = (id: string) =>
  getEventEvent(id, 'EventsUpdated') as EventBridgeEvent<
    gp2Model.EventEvent,
    EventPayload
  >;
