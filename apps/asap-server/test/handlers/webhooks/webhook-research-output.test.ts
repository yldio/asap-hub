import { ResearchOutput } from '@asap-hub/squidex';
import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../../src/config';
import { researchOutputWebhookFactory } from '../../../src/handlers/webhooks/webhook-research-output';
import {
  createResearchOutputEvent,
  updateResearchOutputEvent,
} from '../../fixtures/research-output.fixtures';
import { apiGatewayEvent } from '../../helpers/events';
import { createSignedPayload } from '../../helpers/webhooks';

describe('Research output webhook', () => {
  const evenBridgeMock = {
    putEvents: jest.fn().mockReturnValue({ promise: jest.fn() }),
  } as unknown as jest.Mocked<EventBridge>;
  const handler = researchOutputWebhookFactory(evenBridgeMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should return 403 when the request is not signed correctly', async () => {
    const event = apiGatewayEvent({
      headers: {
        'x-signature': 'XYZ',
      },
      body: JSON.stringify(createResearchOutputEvent),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 and not raise an event when the event type is not supported', async () => {
    const res = (await handler(
      createSignedPayload<ResearchOutput>({
        ...createResearchOutputEvent,
        type: 'SomeEvent',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the research-output-created event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(createResearchOutputEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ResearchOutputCreated',
          Detail: JSON.stringify(createResearchOutputEvent),
        },
      ],
    });
  });

  test('Should put the research-output-updated event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(updateResearchOutputEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ResearchOutputUpdated',
          Detail: JSON.stringify(updateResearchOutputEvent),
        },
      ],
    });
  });
});
