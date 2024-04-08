import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { NewsPayload } from '../../../src/handlers/event-bus';
import { indexNewsHandler } from '../../../src/handlers/news/algolia-index-handler';
import { getNewsEvent, getNewsResponse } from '../../fixtures/news.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { loggerMock } from '../../mocks/logger.mock';
import { newsControllerMock } from '../../mocks/news.controller.mock';

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
describe('News index handler', () => {
  const indexHandler = indexNewsHandler(
    newsControllerMock,
    algoliaSearchClientMock,
    loggerMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should fetch the news and create a record in Algolia when news is published', async () => {
    const newsResponse = getNewsResponse();
    newsControllerMock.fetchById.mockResolvedValueOnce(newsResponse);

    await indexHandler(publishedEvent('42'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: { ...newsResponse, _tags: newsResponse.tags },
      type: 'news',
    });
  });

  test('Should fetch the news and remove the record in Algolia when news is unpublished', async () => {
    const event = unpublishedEvent('42');

    newsControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should throw an error and do not trigger algolia when the news request fails with another error code', async () => {
    newsControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(publishedEvent('42'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    newsControllerMock.fetchById.mockResolvedValueOnce(getNewsResponse());
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(publishedEvent('42'))).rejects.toThrow(
      algoliaError,
    );
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    newsControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaSearchClientMock.remove.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(unpublishedEvent('42'))).rejects.toThrow(
      algoliaError,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events published and unpublished in correct order', async () => {
      const id = '42';
      const createEv = publishedEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      newsControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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
      const id = '42';
      const createEv = publishedEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      newsControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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

const unpublishedEvent = (id: string) =>
  getNewsEvent(id, 'NewsUnpublished') as EventBridgeEvent<
    gp2Model.NewsEvent,
    NewsPayload
  >;

const publishedEvent = (id: string) =>
  getNewsEvent(id, 'NewsPublished') as EventBridgeEvent<
    gp2Model.NewsEvent,
    NewsPayload
  >;
