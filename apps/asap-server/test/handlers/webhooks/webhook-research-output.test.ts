import { ResearchOutput } from '@asap-hub/squidex';
import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../../src/config';
import { researchOutputWebhookFactory } from '../../../src/handlers/webhooks/webhook-research-output';
import {
  getResearchOutputEvent,
  researchOutputEvent,
} from '../../fixtures/research-output.fixtures';
import { getApiGatewayEvent } from '../../helpers/events';
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
    const event = getApiGatewayEvent({
      headers: {
        'x-signature': 'XYZ',
      },
      body: JSON.stringify(getResearchOutputEvent),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 and not raise an event when the event type is not supported', async () => {
    const res = (await handler(
      createSignedPayload<ResearchOutput>({
        ...getResearchOutputEvent(),
        type: 'SomeEvent',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the research-output-created event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(getResearchOutputEvent()),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ResearchOutputCreated',
          Detail: JSON.stringify(getResearchOutputEvent()),
        },
      ],
    });
  });

  test('Should put the research-output-updated event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(
        researchOutputEvent('ResearchOutputsUpdated', 'Updated'),
      ),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ResearchOutputUpdated',
          Detail: JSON.stringify(
            researchOutputEvent('ResearchOutputsUpdated', 'Updated'),
          ),
        },
      ],
    });
  });

  test('Should put the research-output-unpublished event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(
        researchOutputEvent('ResearchOutputsUnpublished', 'Unpublished'),
      ),
    )) as APIGatewayProxyResult;
    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ResearchOutputUnpublished',
          Detail: JSON.stringify(
            researchOutputEvent('ResearchOutputsUnpublished', 'Unpublished'),
          ),
        },
      ],
    });
  });

  test('Should put the research-output-deleted event into the event bus and return 200', async () => {
    const res = (await handler(
      createSignedPayload(
        researchOutputEvent('ResearchOutputsDeleted', 'Deleted'),
      ),
    )) as APIGatewayProxyResult;
    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ResearchOutputDeleted',
          Detail: JSON.stringify(
            researchOutputEvent('ResearchOutputsDeleted', 'Deleted'),
          ),
        },
      ],
    });
  });
});
