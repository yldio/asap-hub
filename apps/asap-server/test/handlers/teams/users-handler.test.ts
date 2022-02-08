import { EventBridgeEvent } from 'aws-lambda';
import { indexUserHandler } from '../../../src/handlers/teams/users-handler';
import {
  TeamsEventType,
  SquidexWebhookTeamPayload,
} from '../../../src/handlers/webhooks/webhook-teams';
import { createEventBridgeEventMock } from '../../helpers/events';
import { getUserResponse } from '../../fixtures/users.fixtures';
import { userControllerMock } from '../../mocks/user-controller.mock';
import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';

describe('Team Users Index', () => {
  const indexHandler = indexUserHandler(
    userControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should fetch every user and create a record on Algolia', async () => {
    const outputs = [
      { ...getUserResponse(), id: 'user-1' },
      { ...getUserResponse(), id: 'user-2' },
      { ...getUserResponse(), id: 'user-3' },
    ];

    userControllerMock.fetchById.mockResolvedValueOnce(outputs[0]!);
    userControllerMock.fetchById.mockRejectedValue(new Error());
    userControllerMock.fetchById.mockResolvedValueOnce(outputs[2]!);

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

  test('Should not trigger algolia save when there are no users associated with the team', async () => {
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
