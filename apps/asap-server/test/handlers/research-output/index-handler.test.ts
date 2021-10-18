import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import {
  indexResearchOutputHandler,
  SquidexWebhookResearchOutputPayload,
} from '../../../src/handlers/research-output/index-handler';
import { ResearchOutputEventType } from '../../../src/handlers/webhooks/webhook-research-output';
import {
  getResearchOutputResponse,
  getResearchOutputEvent,
} from '../../fixtures/research-output.fixtures';
import {
  algoliaClientMock,
  algoliaIndexMock,
} from '../../mocks/algolia-client.mock';
import { researchOutputControllerMock } from '../../mocks/research-outputs-controller.mock';

describe('Research Output index handler', () => {
  const indexHandler = indexResearchOutputHandler(
    researchOutputControllerMock,
    algoliaClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should fetch the research-output and create a record in Algolia when research-output is created', async () => {
    const researchOutputResponse = getResearchOutputResponse();
    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      researchOutputResponse,
    );

    await indexHandler(createEvent('ro-1234'));

    expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
      ...researchOutputResponse,
      objectID: researchOutputResponse.id,
    });
  });

  test('Should fetch the research-output and create a record in Algolia when research-output is updated', async () => {
    const researchOutputResponse = getResearchOutputResponse();
    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      researchOutputResponse,
    );

    await indexHandler(updateEvent('ro-1234'));

    expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
      ...researchOutputResponse,
      objectID: researchOutputResponse.id,
    });
  });

  test('Should remove the record Algolia and throw a 404 error when research-output is unpublished', async () => {
    const event = unpublishedEvent('ro-1234');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
    algoliaIndexMock.deleteObject.mockResolvedValue({ taskID: 2 });

    await expect(indexHandler(event)).rejects.toThrow(Boom.notFound());
    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  test('Should remove the record Algolia and throw a 404 error when research-output is deleted', async () => {
    const event = deleteEvent('ro-1234');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await expect(indexHandler(event)).rejects.toThrow(Boom.notFound());
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

  test('Should throw the algolia error when algolia save method failed', async () => {
    const algoliaError = new Error('ERROR');
    const roID = 'ro-1234';
    const event = updateEvent(roID);

    researchOutputControllerMock.fetchById.mockResolvedValueOnce({
      ...getResearchOutputResponse(),
    });
    algoliaIndexMock.saveObject.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(event)).rejects.toThrow(algoliaError);
  });

  test("Should throw the algolia error when algolia's delete method failed", async () => {
    const algoliaError = new Error('ERROR');
    const roID = 'ro-1234';
    const event = deleteEvent(roID);

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
    algoliaIndexMock.deleteObject.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(event)).rejects.toThrow(algoliaError);
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events created and updated in correct order', async () => {
      const roID = 'ro-1234';
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
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
        ...getResearchOutputResponse(),
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

      await expect(indexHandler(createEv)).rejects.toEqual(Boom.notFound());
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

      await expect(indexHandler(unpublishedEv)).rejects.toEqual(
        Boom.notFound(),
      );
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

      await expect(indexHandler(createEv)).rejects.toEqual(Boom.notFound());
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

      await expect(indexHandler(deleteEv)).rejects.toEqual(Boom.notFound());
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

      await expect(indexHandler(updateEv)).rejects.toEqual(Boom.notFound());
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

      await expect(indexHandler(deleteEv)).rejects.toEqual(Boom.notFound());
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

      await expect(indexHandler(updateEv)).rejects.toEqual(Boom.notFound());
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

      await expect(indexHandler(unpublishedEv)).rejects.toEqual(
        Boom.notFound(),
      );
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
