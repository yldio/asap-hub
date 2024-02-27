import { NotFoundError } from '@asap-hub/errors';
import Boom from '@hapi/boom';
import { indexEventHandler } from '../../../src/handlers/event/algolia-index-event-handler';
import {
  getEventContentfulEvent,
  getEventResponse,
} from '../../fixtures/events.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event.controller.mock';
const algoliaSearchClientMock = getAlgoliaSearchClientMock();

jest.mock('../../../src/utils/logger');
describe('Event index handler', () => {
  const indexHandler = indexEventHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should populate _tags field before saving the event to Algolia', async () => {
    const event = publishEvent();
    const eventResponse = getEventResponse();
    const tags = [
      { id: '1', name: 'Blood' },
      { id: '2', name: 'LRRK2' },
    ];
    eventResponse.tags = tags;

    eventControllerMock.fetchById.mockResolvedValueOnce(eventResponse);

    await indexHandler(event);
    expect(eventControllerMock.fetchById).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: { ...eventResponse, _tags: ['Blood', 'LRRK2']},
      type: 'event',
    });
  });

  test('Should fetch the external author and create a record in Algolia when the external author is published in Contentful', async () => {
    const event = publishEvent();
    const eventResponse = getEventResponse();
    eventControllerMock.fetchById.mockResolvedValueOnce(eventResponse);

    await indexHandler(event);
    expect(eventControllerMock.fetchById).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(eventResponse),
      type: 'event',
    });
  });

  test('Should fetch the event and remove the record in Algolia when event is unpublished', async () => {
    const event = unpublishedEvent();

    eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should fetch the event and remove the record in Algolia when controller throws NotFoundError', async () => {
    const event = unpublishedEvent();

    eventControllerMock.fetchById.mockRejectedValue(
      new NotFoundError(undefined, 'not found'),
    );

    await indexHandler(event);

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should fetch the event and remove the record in Algolia when event is hidden', async () => {
    const event = publishEvent();
    const eventResponse = { ...getEventResponse(), hidden: true };
    eventControllerMock.fetchById.mockResolvedValueOnce(eventResponse);

    await indexHandler(event);

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should throw an error and do not trigger algolia when the event request fails with another error code', async () => {
    eventControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(publishEvent())).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    eventControllerMock.fetchById.mockResolvedValueOnce(getEventResponse());
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(publishEvent())).rejects.toThrow(algoliaError);
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    eventControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(unpublishedEvent())).rejects.toThrow(
      algoliaError,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events published and unpublished in correct order', async () => {
      const eventId = 'event-1234';
      const createEv = publishEvent(eventId);
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
        unpublishedEv.detail.resourceId,
      );
    });

    test('receives the events published and unpublished in reverse order', async () => {
      const eventId = 'event-1234';
      const createEv = publishEvent(eventId);
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
        unpublishedEv.detail.resourceId,
      );
    });
  });
});

const unpublishedEvent = (id: string = 'event-1234') =>
  getEventContentfulEvent(id, 'EventsUnpublished');

const publishEvent = (id: string = 'event-1234') =>
  getEventContentfulEvent(id, 'EventsPublished');
