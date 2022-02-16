import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { Team } from '@asap-hub/squidex';
import { teamsWebhookFactory } from '../../../src/handlers/webhooks/webhook-teams';
import {
  getTeamsCreated,
  getTeamsUpdated,
  getTeamsDeleted,
  getPossibleTeamEvents,
} from '../../fixtures/teams.fixtures';
import { createSignedPayload } from '../../helpers/webhooks';
import { getApiGatewayEvent } from '../../helpers/events';
import { eventBus, eventSource } from '../../../src/config';

describe('Teams webhook', () => {
  const evenBridgeMock = {
    putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<EventBridge>;
  const handler = teamsWebhookFactory(evenBridgeMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should return 403 when the request is not signed correctly', async () => {
    const event = getApiGatewayEvent({
      headers: {
        'x-signature': 'XYZ',
      },
      body: JSON.stringify(getTeamsCreated),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 and not raise an event when the event type is not supported', async () => {
    const res = (await handler(
      createSignedPayload<Team>({
        ...getTeamsCreated,
        type: 'SomeEvent',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test.each(getPossibleTeamEvents)(
    'Should put the %s event into the event bus and return 200',
    async (_, eventName, eventBody) => {
      const res = (await handler(
        createSignedPayload(eventBody),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
        Entries: [
          {
            EventBusName: eventBus,
            Source: eventSource,
            DetailType: eventName,
            Detail: JSON.stringify(eventBody),
          },
        ],
      });
    },
  );
});
