import { EventBridgeEvent } from 'aws-lambda';
import {
  indexHandlerFactory,
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
  const indexHandler = indexHandlerFactory(
    researchOutputControllerMock,
    algoliaClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should fetch the research-output and create a record in Algolia when no records exists yet', async () => {
    const researchOutputResponse = getResearchOutputResponse();
    researchOutputControllerMock.fetchById.mockResolvedValueOnce(
      researchOutputResponse,
    );

    await indexHandler(getEvent());

    expect(algoliaIndexMock.saveObject).toHaveBeenCalledWith({
      ...researchOutputResponse,
      objectID: researchOutputResponse.id,
    });
  });
});

const getEvent = (): EventBridgeEvent<
  ResearchOutputEventType,
  SquidexWebhookResearchOutputPayload
> =>
  createEventBridgeEventMock(
    createResearchOutputSquidexWebhookPayload,
    'ResearchOutputCreated',
  );

const createResearchOutputSquidexWebhookPayload: SquidexWebhookResearchOutputPayload =
  {
    type: 'ResearchOutputsCreated',
    payload: {
      $type: 'EnrichedContentEvent',
      type: 'Created',
      id: '0ecccf93-bd06-4307-90ea-c153fe495580',
    },
  };
