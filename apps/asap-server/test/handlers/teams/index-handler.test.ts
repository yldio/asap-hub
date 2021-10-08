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
import { teamControllerMock } from '../../mocks/team-controller.mock';
import { teamResponse } from '../../fixtures/teams.fixtures';

describe('Team Research Outputs Index', () => {
  const indexHandler = indexHandlerFactory(
    teamControllerMock,
    algoliaClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should fetch the team and create a record in Algolia for every research output', async () => {
    teamControllerMock.fetchById.mockResolvedValueOnce(teamResponse);

    await indexHandler(getEvent());

    expect(algoliaIndexMock.saveObjects).toHaveBeenCalledWith(
      teamResponse.outputs.map((output) => ({
        ...output,
        objectID: output.id,
      })),
    );
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
