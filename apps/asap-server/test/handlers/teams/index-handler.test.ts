import { EventBridgeEvent } from 'aws-lambda';
import {
  indexHandlerFactory,
  SquidexWebhookTeamPayload,
} from '../../../src/handlers/teams/index-handler';
import { TeamsEventType } from '../../../src/handlers/webhooks/webhook-teams';
import { createEventBridgeEventMock } from '../../helpers/events';
import {
  algoliaClientMock,
  algoliaIndexMock,
} from '../../mocks/algolia-client.mock';
import { getResearchOutputResponse } from '../../fixtures/research-output.fixtures';
import { teamControllerMock } from '../../mocks/team-controller.mock';
import { teamResponse } from '../../fixtures/teams.fixtures';

describe('Team Research Outputs Index', () => {
  const indexHandler = indexHandlerFactory(
    teamControllerMock,
    algoliaClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should fetch the team and create a record in Algolia for every research outputs', async () => {
    teamControllerMock.fetchById.mockResolvedValueOnce(teamResponse);
    teamResponse.outputs = [
      { ...getResearchOutputResponse(), id: 'research-outputs-1' },
      { ...getResearchOutputResponse(), id: 'research-outputs-2' },
    ];

    const teamOutputsIndexes = teamResponse.outputs.map((output) => ({
      ...output,
      objectID: output.id,
    }));

    await indexHandler(getEvent());
    expect(algoliaIndexMock.saveObjects).toHaveBeenCalledWith(
      teamOutputsIndexes,
    );
  });

  test('Should not trigger algolia when there are no research outputs', async () => {
    teamControllerMock.fetchById.mockResolvedValueOnce(teamResponse);
    teamResponse.outputs = [];

    await indexHandler(getEvent());
    expect(algoliaIndexMock.saveObjects).not.toHaveBeenCalled();
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
  },
};
