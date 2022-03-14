import { ResearchOutput } from '@asap-hub/squidex';
import { APIGatewayProxyResult } from 'aws-lambda';
import { EventBridge } from 'aws-sdk';
import { eventBus, eventSource } from '../../../src/config';
import {
  researchOutputWebhookFactory,
  SquidexResearchOutputsEventType,
} from '../../../src/handlers/webhooks/webhook-research-output';
import { getResearchOutputWebhookPayload } from '../../fixtures/research-output.fixtures';
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
        getResearchOutputWebhookPayload('ro-1234', 'ResearchOutputsPublished'),
      ),
    });

    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test('Should return 204 and not raise an event when the event type is not supported', async () => {
    const res = (await handler(
      createSignedPayload<ResearchOutput>({
        ...getResearchOutputWebhookPayload(
          'ro-1234',
          'ResearchOutputsPublished',
        ),
        type: 'SomeEvent',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
    expect(evenBridgeMock.putEvents).not.toHaveBeenCalled();
  });

  test.each([
    ['ResearchOutputsPublished', 'ResearchOutputCreated'],
    ['ResearchOutputsUpdated', 'ResearchOutputUpdated'],
    ['ResearchOutputsUnpublished', 'ResearchOutputDeleted'],
    ['ResearchOutputsDeleted', 'ResearchOutputDeleted'],
  ])(
    'Should put the research output %s event into the event bus and return 200',
    async (givenEventType, expectedDetailType) => {
      const payload = getResearchOutputWebhookPayload(
        'ro-1234-id',
        givenEventType as SquidexResearchOutputsEventType,
      );
      const res = (await handler(
        createSignedPayload(payload),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
        Entries: [
          {
            EventBusName: eventBus,
            Source: eventSource,
            DetailType: expectedDetailType,
            Detail: JSON.stringify(payload),
          },
        ],
      });
    },
  );
});
