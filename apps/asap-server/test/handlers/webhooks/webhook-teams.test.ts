import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { Team } from '@asap-hub/squidex';
import { teamsWebhookFactory } from '../../../src/handlers/webhooks/webhook-teams';
import { getTeamsEvent, updateTeamEvent } from '../../fixtures/teams.fixtures';
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
      body: JSON.stringify(getTeamsEvent),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 and not raise an event when the event type is not supported', async () => {
    const res = (await handler(
      createSignedPayload<Team>({
        ...getTeamsEvent(),
        type: 'SomeEvent',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the teams-created event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(getTeamsEvent()),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'TeamsCreated',
          Detail: JSON.stringify(getTeamsEvent()),
        },
      ],
    });
  });
  test('Should put the teams-updated event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(updateTeamEvent()),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'TeamsUpdated',
          Detail: JSON.stringify(updateTeamEvent()),
        },
      ],
    });
  });

  test('Should put the teams-updated event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(updateTeamEvent()),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'TeamsUpdated',
          Detail: JSON.stringify(updateTeamEvent()),
        },
      ],
    });
  });
});
