import { EventBridgeEvent } from 'aws-lambda';
import {
  indexHandlerFactory,
  SquidexWebhookTeamPayload,
} from '../../../src/handlers/teams/index-handler';
import { TeamsEventType } from '../../../src/handlers/webhooks/webhook-teams';
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
    const researchOutputResponse = {
      ...getResearchOutputResponse(),
      id: '0ccccd98-bd06-9821-90ea-7876h5678dx',
    };
    researchOutputControllerMock.fetch.mockResolvedValueOnce({
      total: 0,
      items: [researchOutputResponse],
    });

    await indexHandler(getEvent());

    expect(algoliaIndexMock.saveObjects).toHaveBeenCalledWith([
      {
        ...researchOutputResponse,
        objectID: researchOutputResponse.id,
      },
    ]);
  });
});

const getEvent = (): EventBridgeEvent<
  TeamsEventType,
  SquidexWebhookTeamPayload
> =>
  createEventBridgeEventMock(createTeamSquidexWebhookPayload, 'TeamsCreated');

const createTeamSquidexWebhookPayload: SquidexWebhookTeamPayload = {
  type: 'TeamsCreated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Created',
    id: '0ecccf93-bd06-9821-90ea-783h7te652d',
    data: {
      outputs: { iv: ['0ccccd98-bd06-9821-90ea-7876h54g52d'] },
    },
    dataOld: {
      outputs: {
        iv: [
          '0ccccd98-bd06-9821-90ea-7876h54g52d',
          '0ccccd98-bd06-9821-90ea-7876h5678dx',
        ],
      },
    },
  },
};
