import { EventBridgeEvent } from 'aws-lambda';
import {
  indexResearchOutputHandler,
  SquidexWebhookResearchOutputPayload,
} from '../../../src/handlers/research-output/index-handler';
import { ResearchOutputEventType } from '../../../src/handlers/webhooks/webhook-research-output';
import { getResearchOutputResponse } from '../../fixtures/research-output.fixtures';
import { createEventBridgeEventMock } from '../../helpers/events';
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

    await indexHandler(
      createEventBridgeEventMock(
        {
          type: 'ResearchOutputsPublished',
          payload: {
            $type: 'EnrichedContentEvent',
            type: 'Published',
            id: '0ecccf93-bd06-4307-90ea-c153fe495580',
          },
        },
        'ResearchOutputCreated',
      ),
    );

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

    await indexHandler(
      createEventBridgeEventMock(
        {
          type: 'ResearchOutputsUpdated',
          payload: {
            $type: 'EnrichedContentEvent',
            type: 'Published',
            id: '0ecccf93-bd06-4307-90ea-c153fe495580',
          },
        },
        'ResearchOutputUpdated',
      ),
    );

    expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
      ...researchOutputResponse,
      objectID: researchOutputResponse.id,
    });
  });

  test('Should remove the record Algolia when research-output when research-output is not found', async () => {
    researchOutputControllerMock.fetchById.mockRejectedValueOnce({
      statusCode: 404,
    });

    const event: EventBridgeEvent<
      ResearchOutputEventType,
      SquidexWebhookResearchOutputPayload
    > = createEventBridgeEventMock(
      {
        type: 'ResearchOutputsUnpublished',
        payload: {
          $type: 'EnrichedContentEvent',
          type: 'Unpublished',
          id: '0ecccf93-bd06-4307-90ea-c153fe495580',
        },
      },
      'ResearchOutputDeleted',
    );

    await indexHandler(event);

    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  test('Should not relay on the order of the events, i.e. unpublished and published', async () => {
    const researchOutputResponse = getResearchOutputResponse();
    researchOutputControllerMock.fetchById.mockRejectedValueOnce(new Error());

    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      researchOutputResponse,
    );

    await indexHandler(
      createEventBridgeEventMock(
        {
          type: 'ResearchOutputsUnpublished',
          payload: {
            $type: 'EnrichedContentEvent',
            type: 'Unpublished',
            id: researchOutputResponse.id,
          },
        },
        'ResearchOutputDeleted',
      ),
    );

    await indexHandler(
      createEventBridgeEventMock(
        {
          type: 'ResearchOutputsUpdated',
          payload: {
            $type: 'EnrichedContentEvent',
            type: 'Published',
            id: researchOutputResponse.id,
          },
        },
        'ResearchOutputUpdated',
      ),
    );

    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      researchOutputResponse.id,
    );
    expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
      ...researchOutputResponse,
      objectID: researchOutputResponse.id,
    });
  });
});
