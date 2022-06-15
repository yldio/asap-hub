import Boom from '@hapi/boom';
import { indexEventHandler } from '../../../src/handlers/event/index-event-handler';
import {
  getEventEvent,
  getEventResponse,
} from '../../fixtures/events.fixtures';
import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event-controller.mock';

describe('Event index handler', () => {
  const indexHandler = indexEventHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should fetch the event and create a record in Algolia when the event is created', async () => {
    const event = createEvent();
    const eventResponse = getEventResponse();
    eventControllerMock.fetchById.mockResolvedValueOnce(eventResponse);

    await indexHandler(event);
    expect(eventControllerMock.fetchById).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: eventResponse,
      type: 'event',
    });
  });

  test('Should fetch the event and create a record in Algolia when event is updated', async () => {
    const eventResponse = getEventResponse();
    eventControllerMock.fetchById.mockResolvedValueOnce(eventResponse);

    await indexHandler(updateEvent());

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: eventResponse,
      type: 'event',
    });
  });

  test('Should fetch the event and remove the record in Algolia when event is unpublished', async () => {
    const event = unpublishedEvent();

    eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  test('Should fetch the event and remove the record in Algolia when event is deleted', async () => {
    const event = deleteEvent();

    eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  test('Should throw an error and do not trigger algolia when the event request fails with another error code', async () => {
    eventControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(createEvent())).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    eventControllerMock.fetchById.mockResolvedValueOnce(getEventResponse());
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(updateEvent())).rejects.toThrow(algoliaError);
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(deleteEvent())).rejects.toThrow(algoliaError);
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events created and updated in correct order', async () => {
      const eventId = 'event-1234';
      const eventResponse = {
        data: { ...getEventResponse(), id: eventId },
        type: 'event',
      };

      eventControllerMock.fetchById.mockResolvedValue({
        ...eventResponse.data,
      });

      await indexHandler(createEvent(eventId));
      await indexHandler(updateEvent(eventId));

      expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.save).toHaveBeenCalledWith(eventResponse);
    });

    test('receives the events created and updated in reverse order', async () => {
      const eventId = 'event-1234';
      const eventResponse = {
        data: { ...getEventResponse(), id: 'event-1234' },
        type: 'event',
      };

      eventControllerMock.fetchById.mockResolvedValue(eventResponse.data);

      await indexHandler(updateEvent(eventId));
      await indexHandler(createEvent(eventId));

      expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.save).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.save).toHaveBeenCalledWith(eventResponse);
    });

    test('receives the events created and unpublished in correct order', async () => {
      const eventId = 'event-1234';
      const createEv = createEvent(eventId);
      const unpublishedEv = unpublishedEvent(eventId);
      const algoliaError = new Error('ERROR');

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });

    test('receives the events created and unpublished in reverse order', async () => {
      const eventId = 'event-1234';
      const createEv = createEvent(eventId);
      const unpublishedEv = unpublishedEvent(eventId);
      const algoliaError = new Error('ERROR');

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });

    test('receives the events created and deleted in correct order', async () => {
      const eventId = 'event-1234';
      const createEv = createEvent(eventId);
      const deleteEv = deleteEvent(eventId);
      const algoliaError = new Error('ERROR');

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    test('receives the events created and deleted in reverse order', async () => {
      const eventId = 'event-1234';
      const createEv = createEvent(eventId);
      const deleteEv = deleteEvent(eventId);
      const algoliaError = new Error('ERROR');

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);
      await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    test('receives the events updated and deleted in correct order', async () => {
      const eventId = 'event-1234';
      const updateEv = updateEvent(eventId);
      const deleteEv = deleteEvent(eventId);
      const algoliaError = new Error('ERROR');

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);
      await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    test('receives the events updated and deleted in reverse order', async () => {
      const eventId = 'event-1234';
      const updateEv = updateEvent(eventId);
      const deleteEv = deleteEvent(eventId);
      const algoliaError = new Error('ERROR');

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);
      await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });
    test('receives the events updated and unpublished in correct order', async () => {
      const eventId = 'event-1234';
      const updateEv = updateEvent(eventId);
      const unpublishedEv = unpublishedEvent(eventId);
      const algoliaError = new Error('ERROR');

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });

    test('receives the events updated and unpublished in reverse order', async () => {
      const eventId = 'event-1234';
      const updateEv = updateEvent(eventId);
      const unpublishedEv = unpublishedEvent(eventId);
      const algoliaError = new Error('ERROR');

      eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaSearchClientMock.remove.mockResolvedValueOnce(undefined);
      algoliaSearchClientMock.remove.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);

      expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(2);
      expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });
  });
});

const unpublishedEvent = (id: string = 'event-1234') =>
  getEventEvent(id, 'EventsUnpublished');

const deleteEvent = (id: string = 'event-1234') =>
  getEventEvent(id, 'EventsDeleted');

const createEvent = (id: string = 'event-1234') =>
  getEventEvent(id, 'EventsPublished');

const updateEvent = (id: string = 'event-1234') =>
  getEventEvent(id, 'EventsUpdated');
