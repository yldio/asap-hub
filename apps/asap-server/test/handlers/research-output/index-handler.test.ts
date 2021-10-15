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
    await indexHandler(event);

    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  test('Should remove the record Algolia when research-output is deleted', async () => {
    const event = deleteEvent('ro-1234');
    await indexHandler(event);

    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  describe('Should process all events, and not relay on the order', () => {
    it('receives on correct order the events created and updated', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const updateEv = updateEvent(roID);
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValueOnce({
        ...researchOutputResponse,
        title: 'Original title',
      });

      await indexHandler(createEv);
      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        title: 'Original title',
        objectID: researchOutputResponse.id,
      });

      researchOutputControllerMock.fetchById.mockResolvedValueOnce({
        ...researchOutputResponse,
        title: 'New title',
      });

      await indexHandler(updateEv);
      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(2);
      expect(algoliaIndexMock.saveObject).toHaveBeenLastCalledWith({
        ...researchOutputResponse,
        title: 'New title',
        objectID: researchOutputResponse.id,
      });
    });

    it('receives on reverse order the events created and updated', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const updateEv = updateEvent(roID);
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      researchOutputControllerMock.fetchById.mockResolvedValueOnce({
        ...researchOutputResponse,
        title: 'Updated title',
      });

      await indexHandler(updateEv);
      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenLastCalledWith({
        ...researchOutputResponse,
        title: 'Updated title',
        objectID: researchOutputResponse.id,
      });

      researchOutputControllerMock.fetchById.mockResolvedValueOnce({
        ...researchOutputResponse,
        title: 'Old title',
      });
      await indexHandler(createEv);

      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenLastCalledWith({
        ...researchOutputResponse,
        title: 'Old title',
        objectID: researchOutputResponse.id,
      });
    });
    it('receives on correct order the events created and unpublished', async () => {
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

      await indexHandler(createEv);
      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });

      await indexHandler(unpublishedEv);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });
    it('receives on reverser order the events created and unpublished', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      await indexHandler(unpublishedEv);
      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );

      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );

      await indexHandler(createEv);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
    });

    it('receives on correct order the events created and deleted', async () => {
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

      await indexHandler(createEv);
      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });

      await indexHandler(deleteEv);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });

    it('receives on reverse order the events created and deleted', async () => {
      const roID = 'ro-1234';
      const createEv = createEvent(roID);
      const deleteEv = deleteEvent(roID);
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      await indexHandler(deleteEv);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();

      researchOutputControllerMock.fetchById.mockResolvedValueOnce(
        researchOutputResponse,
      );

      await indexHandler(createEv);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
    });

    it('receives on correct order the events updated and deleted', async () => {
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

      await indexHandler(updateEv);
      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });

      await indexHandler(deleteEv);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );
    });
    it('receives on reverse order the events updated and deleted', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const deleteEv = deleteEvent(roID);
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      await indexHandler(deleteEv);
      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        deleteEv.detail.payload.id,
      );

      researchOutputControllerMock.fetchById.mockResolvedValueOnce({
        ...researchOutputResponse,
        title: 'New title',
      });

      await indexHandler(updateEv);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        title: 'New title',
        objectID: researchOutputResponse.id,
      });
    });
    it('receives on correct order the events updated and unpublished', async () => {
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

      await indexHandler(updateEv);
      expect(algoliaIndexMock.deleteObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });

      await indexHandler(unpublishedEv);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );
    });
    it('receives on reverse order the events updated and deleted', async () => {
      const roID = 'ro-1234';
      const updateEv = updateEvent(roID);
      const unpublishedEv = unpublishedEvent(roID);
      const researchOutputResponse = {
        ...getResearchOutputResponse(),
        id: roID,
      };

      await indexHandler(unpublishedEv);
      expect(algoliaIndexMock.saveObject).not.toHaveBeenCalled();
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
        unpublishedEv.detail.payload.id,
      );

      researchOutputControllerMock.fetchById.mockResolvedValueOnce({
        ...researchOutputResponse,
      });

      await indexHandler(updateEv);
      expect(algoliaIndexMock.deleteObject).toHaveBeenCalledTimes(1);
      expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      });
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
