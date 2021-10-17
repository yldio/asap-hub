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

  test('Should remove the record Algolia when research-output is unpublished', async () => {
    const event = unpublishedEvent('ro-1234');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

    await indexHandler(event);

    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  test('Should remove the record Algolia when research-output is deleted', async () => {
    const event = deleteEvent('ro-1234');

    researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
    await indexHandler(event);

    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  describe('Should process the events, handle race conditions and not rely on the order of the events', () => {
    test('receives the events created and updated in correct order', async () => {
      const roID = 'ro-1234';
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValueOnce({
        ...researchOutputResponse,
      });
      researchOutputControllerMock.fetchById.mockResolvedValueOnce({
        ...researchOutputResponse,
        title: 'Title 1',
      });
      await indexHandler(createEvent(roID));
      await indexHandler(updateEvent(roID));

      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenNthCalledWith(1, {
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
      expect(algoliaIndexMock.saveObject).toHaveBeenNthCalledWith(2, {
        ...researchOutputResponse,
        title: 'Title 1',
        objectID: researchOutputResponse.id,
      });
    });

    test('receives the events created and updated in reverse order', async () => {
      const roID = 'ro-1234';
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValueOnce({
        ...researchOutputResponse,
        title: 'Title 1',
      });
      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );

      await indexHandler(updateEvent(roID));
      await indexHandler(createEvent(roID));

      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenNthCalledWith(1, {
        ...researchOutputResponse,
        title: 'Title 1',
        objectID: researchOutputResponse.id,
      });
      expect(algoliaIndexMock.saveObject).toHaveBeenNthCalledWith(2, {
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
    });

    test('receives the events created and unpublished in correct order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);

      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );
      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

      await indexHandler(createEv);
      await indexHandler(unpublishedEv);

      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
    });

    test('receives the reverse created and unpublished in correct order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

      await indexHandler(unpublishedEv);
      await indexHandler(createEv);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });

    test('receives the events created and deleted in correct order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const deleteEv = deleteEvent(roID);

      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );
      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

      await indexHandler(createEv);
      await indexHandler(deleteEv);

      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
    });

    test('receives the events created and deleted in reverse order', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const deleteEv = deleteEvent(roID);

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

      await indexHandler(deleteEv);
      await indexHandler(createEv);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    test('receives the events updated and deleted in correct order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const deleteEv = deleteEvent(roID);

      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );
      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

      await indexHandler(updateEv);
      await indexHandler(deleteEv);

      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
    });
    test('receives the events updated and deleted in reverse order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const deleteEv = deleteEvent(roID);

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

      await indexHandler(deleteEv);
      await indexHandler(updateEv);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });
    test('receives the events updated and unpublished in correct order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);

      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );
      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

      await indexHandler(updateEv);
      await indexHandler(unpublishedEv);

      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
    });
    test('receives the events updated and unpublished in reverse order', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);

      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());
      researchOutputControllerMock.fetchById.mockRejectedValue(Boom.notFound());

      await indexHandler(unpublishedEv);
      await indexHandler(updateEv);

      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
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
