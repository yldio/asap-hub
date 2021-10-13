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
          type: 'ResearchOutputsCreated',
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

  test('Should remove the record Algolia when research-output has been converted to draft', async () => {
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
      'ResearchOutputUnpublished',
    );
    await indexHandler(event);

    expect(researchOutputControllerMock.fetchById).not.toHaveBeenCalled();
    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  test('Should remove the record Algolia when research-output has been converted to draft', async () => {
    const event: EventBridgeEvent<
      ResearchOutputEventType,
      SquidexWebhookResearchOutputPayload
    > = createEventBridgeEventMock(
      {
        type: 'ResearchOutputsDeleted',
        payload: {
          $type: 'EnrichedContentEvent',
          type: 'Unpublished',
          id: '0ecccf93-bd06-4307-90ea-c153fe495580',
        },
      },
      'ResearchOutputDeleted',
    );

    await indexHandler(event);

    expect(researchOutputControllerMock.fetchById).not.toHaveBeenCalled();
    expect(algoliaIndexMock.deleteObject).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });
});
