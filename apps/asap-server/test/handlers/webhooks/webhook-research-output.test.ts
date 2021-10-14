import { ResearchOutput } from '@asap-hub/squidex';
import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../../src/config';
import { researchOutputWebhookFactory } from '../../../src/handlers/webhooks/webhook-research-output';
import { researchOutputEvent } from '../../fixtures/research-output.fixtures';
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
      body: JSON.stringify(
        researchOutputEvent('ResearchOutputsPublished', 'Published'),
      ),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 and not raise an event when the event type is not supported', async () => {
    const res = (await handler(
      createSignedPayload<ResearchOutput>({
        ...researchOutputEvent('ResearchOutputsPublished', 'Published'),
        type: 'SomeEvent',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should put the research-output-created event into the event bus and return 200', async () => {
    const createEvent = researchOutputEvent(
      'ResearchOutputsPublished',
      'Published',
    );

    const res = (await handler(
      createSignedPayload(createEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ResearchOutputCreated',
          Detail: JSON.stringify(createEvent),
        },
      ],
    });
  });

  test('Should put the research-output-updated event into the event bus and return 200', async () => {
    const updateEvent = researchOutputEvent(
      'ResearchOutputsUpdated',
      'Updated',
    );

    const res = (await handler(
      createSignedPayload(updateEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ResearchOutputUpdated',
          Detail: JSON.stringify(updateEvent),
        },
      ],
    });
  });

  test('Should put the research-output-deleted event into the event bus and return 200', async () => {
    const deleteEvent = researchOutputEvent(
      'ResearchOutputsDeleted',
      'Deleted',
    );

    const res = (await handler(
      createSignedPayload(deleteEvent),
    )) as APIGatewayProxyResult;
    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ResearchOutputDeleted',
          Detail: JSON.stringify(deleteEvent),
        },
      ],
    });
  });

  test('Should treat the research-output-unpublished event as research-output-deleted', async () => {
    const unpublishedEvent = researchOutputEvent(
      'ResearchOutputsUnpublished',
      'Unpublished',
    );

    const res = (await handler(
      createSignedPayload(unpublishedEvent),
    )) as APIGatewayProxyResult;
    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'ResearchOutputDeleted',
          Detail: JSON.stringify(unpublishedEvent),
        },
      ],
    });
  });
});
