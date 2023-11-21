import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { UserPayload } from '../../../src/handlers/event-bus';
import { indexUserHandler } from '../../../src/handlers/user/algolia-index-handler';
import { getUserEvent, getUserResponse } from '../../fixtures/user.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { loggerMock } from '../../mocks/logger.mock';
import { userControllerMock } from '../../mocks/user.controller.mock';

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
describe('User index handler', () => {
  const indexHandler = indexUserHandler(
    userControllerMock,
    algoliaSearchClientMock,
    loggerMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should fetch the user and create a record in Algolia when user is published', async () => {
    const userResponse = getUserResponse();
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await indexHandler(publishedEvent('42'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: expect.objectContaining(userResponse),
      type: 'user',
    });
  });

  test('Should populate the _tags field before saving the user to Algolia', async () => {
    const userResponse = getUserResponse();
    userResponse.tags = [{ id: '1', name: 'user tag' }];
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await indexHandler(publishedEvent('42'));
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: {
        ...userResponse,
        _tags: expect.arrayContaining(['user tag']),
      },
      type: 'user',
    });
  });

  test('Should fetch the user and remove a record in Algolia when user is published but not onboarded', async () => {
    const userResponse = {
      ...getUserResponse(),
      onboarded: false,
    };
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await indexHandler(publishedEvent(userResponse.id));

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      userResponse.id,
    );
  });

  test('Should fetch the user and remove a record in Algolia when user is published but Hidden', async () => {
    const userResponse = getUserResponse();
    userControllerMock.fetchById.mockResolvedValueOnce({
      ...userResponse,
      role: 'Hidden',
    });

    await indexHandler(publishedEvent(userResponse.id));

    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      userResponse.id,
    );
  });

  test('Should fetch the user and remove the record in Algolia when user is unpublished', async () => {
    const event = unpublishedEvent('42');

    userControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledTimes(1);
    expect(algoliaSearchClientMock.remove).toHaveBeenCalledWith(
      event.detail.resourceId,
    );
  });

  test('Should throw an error and do not trigger algolia when the user request fails with another error code', async () => {
    userControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(publishedEvent('42'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.remove).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    userControllerMock.fetchById.mockResolvedValueOnce(getUserResponse());
    algoliaSearchClientMock.save.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(publishedEvent('42'))).rejects.toThrow(
      algoliaError,
    );
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    userControllerMock.fetchById.mockRejectedValue(Boom.notFound());

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

      userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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

    test('receives the events created and unpublished in reverse order', async () => {
      const id = '42';
      const publishedEv = publishedEvent(id);
      const unpublishedEv = unpublishedEvent(id);
      const algoliaError = new Error('ERROR');

      userControllerMock.fetchById.mockRejectedValue(Boom.notFound());
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
  getUserEvent(id, 'UsersUnpublished') as EventBridgeEvent<
    gp2Model.UserEvent,
    UserPayload
  >;

const publishedEvent = (id: string) =>
  getUserEvent(id, 'UsersPublished') as EventBridgeEvent<
    gp2Model.UserEvent,
    UserPayload
  >;
