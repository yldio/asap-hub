import { EventBridge } from '@aws-sdk/client-eventbridge';
import { APIGatewayProxyResult } from 'aws-lambda';
import { contentfulPollerFactory } from '../../../src/handlers/webhooks/webhook-contentful-poller';
import { getNewsPublishContentfulPollerPayload } from '../../fixtures/news.fixtures';
import { getLambdaRequest } from '../../helpers/events';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  getCDAClient: () => ({
    getEntry: jest.fn().mockResolvedValue({
      sys: {
        id: '1',
        revision: 5,
      },
      fields: {},
    }),
  }),
}));

describe('Contentful poller event webhook', () => {
  const evenBridgeMock = {
    putEvents: jest.fn(),
  } as unknown as jest.Mocked<EventBridge>;
  const handler = contentfulPollerFactory(evenBridgeMock);

  beforeEach(jest.resetAllMocks);

  test('Should put the news-published event into the event bus and return 200', async () => {
    const payload = getNewsPublishContentfulPollerPayload();
    const event = getLambdaRequest(payload, {});
    const res = (await handler(event)) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalled();
  });
});
