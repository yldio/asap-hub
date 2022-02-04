import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { indexUserHandler } from '../../../src/handlers/user/index-handler';
import { getUserResponse } from '../../fixtures/users.fixtures';
import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { userControllerMock } from '../../mocks/user-controller.mock';

describe('User index handler', () => {
  const indexHandler = indexUserHandler(
    userControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should fetch the user and create a record in Algolia when the user is created', async () => {
    const userResponse = getUserResponse();
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await indexHandler(createEvent('user-1234'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith(userResponse);
  });

  test('Should fetch the research-output and create a record in Algolia when research-output is updated', async () => {
    const userResponse = getUserResponse();
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await indexHandler(updateEvent('user-1234'));

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith(userResponse);
  });

  test('Should fetch the research-output and remove the record in Algolia when research-output is unpublished', async () => {
    const event = unpublishedEvent('ro-1234');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  test('Should fetch the research-output and remove the record in Algolia when research-output is deleted', async () => {
    const event = deleteEvent('ro-1234');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  test('Should throw an error and do not trigger algolia when the research-output request fails with another error code', async () => {
    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(indexHandler(createEvent('ro-1234'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      getResearchOutputAlgoliaResponse(),
    );
    algoliaIndexMock.saveObject.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(updateEvent('ro-1234'))).rejects.toThrow(
      algoliaError,
    );
  });

  test('Should throw the algolia error when deleting the record fails', async () => {
    const algoliaError = new Error('ERROR');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    algoliaIndexMock.deleteObject.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(deleteEvent('ro-1234'))).rejects.toThrow(
      algoliaError,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events created and updated in correct order', async () => {
      const roID = 'ro-1234';
      const researchOutputResponse = {
        ...getResearchOutputAlgoliaResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValue({
        ...researchOutputResponse,
      });

      await indexHandler(createEvent(roID));
      await indexHandler(updateEvent(roID));

      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
    });

    test('receives the events created and updated in reverse order', async () => {
      const roID = 'ro-1234';
      const researchOutputResponse = {
        ...getResearchOutputAlgoliaResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValue(
        researchOutputResponse,
      );

      await indexHandler(updateEvent(roID));
      await indexHandler(createEvent(roID));

      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
    });

    test('receives the events created and unpublished in correct order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaIndexMock.deleteObject.mockResolvedValueOnce({ taskID: 1 });
      algoliaIndexMock.deleteObject.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });

    test('receives the events created and unpublished in reverse order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaIndexMock.deleteObject.mockResolvedValueOnce({ taskID: 1 });
      algoliaIndexMock.deleteObject.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });

    test('receives the events created and deleted in correct order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const deleteEv = deleteEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaIndexMock.deleteObject.mockResolvedValueOnce({ taskID: 1 });
      algoliaIndexMock.deleteObject.mockRejectedValue(algoliaError);

      await indexHandler(createEv);
      await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    test('receives the events created and deleted in reverse order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const deleteEv = deleteEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaIndexMock.deleteObject.mockResolvedValueOnce({ taskID: 1 });
      algoliaIndexMock.deleteObject.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);
      await expect(indexHandler(createEv)).rejects.toEqual(algoliaError);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    test('receives the events updated and deleted in correct order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const deleteEv = deleteEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaIndexMock.deleteObject.mockResolvedValueOnce({ taskID: 1 });
      algoliaIndexMock.deleteObject.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);
      await expect(indexHandler(deleteEv)).rejects.toEqual(algoliaError);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    test('receives the events updated and deleted in reverse order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const deleteEv = deleteEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaIndexMock.deleteObject.mockResolvedValueOnce({ taskID: 1 });
      algoliaIndexMock.deleteObject.mockRejectedValue(algoliaError);

      await indexHandler(deleteEv);
      await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });
    test('receives the events updated and unpublished in correct order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaIndexMock.deleteObject.mockResolvedValueOnce({ taskID: 1 });
      algoliaIndexMock.deleteObject.mockRejectedValue(algoliaError);

      await indexHandler(updateEv);
      await expect(indexHandler(unpublishedEv)).rejects.toEqual(algoliaError);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });

    test('receives the events updated and unpublished in reverse order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);
      const algoliaError = new Error('ERROR');

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      algoliaIndexMock.deleteObject.mockResolvedValueOnce({ taskID: 1 });
      algoliaIndexMock.deleteObject.mockRejectedValue(algoliaError);

      await indexHandler(unpublishedEv);
      await expect(indexHandler(updateEv)).rejects.toEqual(algoliaError);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });
  });
});

const unpublishedEvent = (id: string) =>
  getResearchOutputEvent(
    id,
    'ResearchOutputsUnpublished',
    'ResearchOutputDeleted',
  ) as EventBridgeEvent<
    ResearchOutputEventType,
    SquidexWebhookResearchOutputPayload
  >;

const deleteEvent = (id: string) =>
  getResearchOutputEvent(
    id,
    'ResearchOutputsDeleted',
    'ResearchOutputDeleted',
  ) as EventBridgeEvent<
    ResearchOutputEventType,
    SquidexWebhookResearchOutputPayload
  >;

const createEvent = (id: string) =>
  getResearchOutputEvent(
    id,
    'ResearchOutputsPublished',
    'ResearchOutputCreated',
  ) as EventBridgeEvent<
    ResearchOutputEventType,
    SquidexWebhookResearchOutputPayload
  >;

const updateEvent = (id: string) =>
  getResearchOutputEvent(
    id,
    'ResearchOutputsUpdated',
    'ResearchOutputUpdated',
  ) as EventBridgeEvent<
    ResearchOutputEventType,
    SquidexWebhookResearchOutputPayload
  >;
