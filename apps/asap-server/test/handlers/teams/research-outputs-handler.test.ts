import { EventBridgeEvent } from 'aws-lambda';
import {
  indexResearchOutputByTeamHandler,
  SquidexWebhookTeamPayload,
} from '../../../src/handlers/teams/research-outputs-handler';
import { TeamsEventType } from '../../../src/handlers/webhooks/webhook-teams';
import { createEventBridgeEventMock } from '../../helpers/events';
import { getResearchOutputResponse } from '../../fixtures/research-output.fixtures';
import { researchOutputControllerMock } from '../../mocks/research-outputs-controller.mock';
import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';

describe('Team Research Outputs Index', () => {
  const indexHandler = indexResearchOutputByTeamHandler(
    researchOutputControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should fetch every research output and create a record on Algolia', async () => {
    const outputs = [
      { ...getResearchOutputResponse(), id: 'research-outputs-1' },
      { ...getResearchOutputResponse(), id: 'research-outputs-2' },
      { ...getResearchOutputResponse(), id: 'research-outputs-3' },
    ];

    researchOutputControllerMock.fetchById.mockResolvedValueOnce(outputs[0]!);
    researchOutputControllerMock.fetchById.mockRejectedValue(new Error());
    researchOutputControllerMock.fetchById.mockResolvedValueOnce(outputs[2]!);

    const updateEvent = getEvent();

    updateEvent.detail.payload = {
      ...updateEvent.detail.payload,
      data: { outputs: { iv: outputs.slice(0, 2).map(({ id }) => id) } },
      dataOld: { outputs: { iv: [outputs[2]!.id] } },
    };

    await indexHandler(updateEvent);

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith(outputs[0]);
    expect(algoliaSearchClientMock.save).not.toHaveBeenCalledWith(outputs[1]);
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith(outputs[2]);
  });

  test('Should not trigger algolia save when there are no research outputs associated with the team', async () => {
    const updateEvent = getEvent();
    updateEvent.detail.payload = {
      ...updateEvent.detail.payload,
      data: {
        outputs: { iv: [] },
      },
      dataOld: {
        outputs: { iv: [] },
      },
    };

    await indexHandler(updateEvent);
    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
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
      outputs: {
        iv: [],
      },
    },
    dataOld: {
      outputs: {
        iv: [],
      },
    },
  },
};
