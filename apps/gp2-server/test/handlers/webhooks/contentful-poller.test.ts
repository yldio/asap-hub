import { EventBridge } from '@aws-sdk/client-eventbridge';
import { contentfulPollerFactory } from '../../../src/handlers/webhooks/contentful-poller';
import { getNewsPublishContentfulPollerPayload } from '../../fixtures/news.fixtures';

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
    const event = getNewsPublishContentfulPollerPayload();
    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalled();
  });
});
