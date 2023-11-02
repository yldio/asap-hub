import {
  ContentfulClientApi,
  pollContentfulDeliveryApi,
} from '@asap-hub/contentful';
import { WebhookDetailType } from '@asap-hub/model';
import { EventBridge } from '@aws-sdk/client-eventbridge';
import { contentfulPollerHandlerFactory } from '../../../src/handlers/webhooks';
import {
  getNewsContentfulPollerPayload,
  getNewsPublishContentfulPollerPayload,
  getNewsPublishContentfulPollerRecord,
  getNewsPublishContentfulWebhookPayload,
} from '../../fixtures/news.fixtures';
import { loggerMock as logger } from '../../mocks/logger.mock';
const mockGetEntry: jest.MockedFunction<
  ContentfulClientApi<undefined>['getEntry']
> = jest.fn();

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  getCDAClient: () => ({
    getEntry: mockGetEntry,
  }),
  pollContentfulDeliveryApi: jest.fn(),
}));

describe('Contentful poller webhook', () => {
  const eventBus = 'event-bus';
  const eventSource = 'event-source';
  const evenBridgeMock = {
    putEvents: jest.fn(),
  } as unknown as jest.Mocked<EventBridge>;
  const handler = contentfulPollerHandlerFactory(
    evenBridgeMock,
    {
      eventBus,
      eventSource,
      space: '',
      environment: '',
      accessToken: '',
    },
    logger,
  );

  beforeEach(jest.resetAllMocks);

  beforeEach(() => {
    mockGetEntry.mockResolvedValue({
      sys: {
        id: '1',
        revision: 5,
      },
      fields: {},
    } as unknown as ReturnType<ContentfulClientApi<undefined>['getEntry']>);

    (
      pollContentfulDeliveryApi as jest.MockedFunction<
        typeof pollContentfulDeliveryApi
      >
    ).mockImplementation(
      jest.requireActual('@asap-hub/contentful').pollContentfulDeliveryApi,
    );
  });

  test('Should log an error when it fails to fetch the entry from Contentful and then retry', async () => {
    const event = getNewsPublishContentfulPollerPayload();

    mockGetEntry.mockRejectedValueOnce(new Error());

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(200);
  });

  test('Should error when there is no revision', async () => {
    const webHookPayload = getNewsPublishContentfulWebhookPayload();
    delete (webHookPayload.sys as any).revision;
    const event = getNewsPublishContentfulPollerPayload({
      ...getNewsPublishContentfulPollerRecord,
      body: JSON.stringify(webHookPayload),
    });

    mockGetEntry.mockRejectedValueOnce(new Error());

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
    expect(logger.error).toBeCalledWith(
      expect.stringMatching(/Invalid payload/i),
    );
  });
  test('Should error when there is no Detail Type', async () => {
    const { messageAttributes } = getNewsPublishContentfulPollerRecord();
    delete messageAttributes.DetailType;
    const event = getNewsPublishContentfulPollerPayload({
      ...getNewsPublishContentfulPollerRecord,
      messageAttributes,
    });

    mockGetEntry.mockRejectedValueOnce(new Error());

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
    expect(logger.error).toBeCalledWith(
      expect.stringMatching(/Invalid payload/i),
    );
  });

  test('Should error when there is no Action', async () => {
    const { messageAttributes } = getNewsPublishContentfulPollerRecord();
    delete messageAttributes.Action;
    const event = getNewsPublishContentfulPollerPayload({
      ...getNewsPublishContentfulPollerRecord,
      messageAttributes,
    });

    mockGetEntry.mockRejectedValueOnce(new Error());

    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
    expect(logger.error).toBeCalledWith(
      expect.stringMatching(/Invalid payload/i),
    );
  });
  test('Should put the news-published event into the event bus and return 200', async () => {
    const event = getNewsPublishContentfulPollerPayload();
    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'NewsPublished' satisfies WebhookDetailType,
          Detail: event.Records[0]!.body,
        },
      ],
    });
    expect(logger.debug).toBeCalledWith(
      expect.stringMatching(/Event added to event-bus/i),
    );
  });

  test('Should log errors when they occur', async () => {
    const event = getNewsPublishContentfulPollerPayload();
    evenBridgeMock.putEvents = jest
      .fn()
      .mockRejectedValue(new Error('error message from putEvents'));
    const handlerWithError = contentfulPollerHandlerFactory(
      evenBridgeMock,
      {
        eventBus,
        eventSource,
        space: '',
        environment: '',
        accessToken: '',
      },
      logger,
    );
    const { statusCode } = await handlerWithError(event);
    expect(logger.error).toBeCalledTimes(2);
    expect(logger.error).nthCalledWith(
      1,
      expect.stringMatching(
        /An error occurred putting onto the event bus event-bus/i,
      ),
    );
    expect(logger.error).nthCalledWith(
      2,
      expect.stringMatching(
        /The error message\: error message from putEvents/i,
      ),
    );
    expect(statusCode).toStrictEqual(500);
  });

  test('Should put the news-unpublished event to event bus and return 200 when the entry has been deleted', async () => {
    mockGetEntry.mockReset();
    mockGetEntry.mockRejectedValue(
      new Error('The resource could not be found'),
    );
    const record = getNewsPublishContentfulPollerRecord();
    const event = getNewsPublishContentfulPollerPayload({
      ...record,
      messageAttributes: {
        ...record.messageAttributes,
        DetailType: {
          dataType: 'String',
          stringValue: 'NewsUnpublished' satisfies WebhookDetailType,
        },
        Action: { dataType: 'String', stringValue: 'unpublish' },
      },
    });
    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'NewsUnpublished' satisfies WebhookDetailType,
          Detail: event.Records[0]!.body,
        },
      ],
    });
    expect(logger.debug).toBeCalledWith(
      expect.stringMatching(/Event added to event-bus/i),
    );
  });

  test('Should put the news-published event to event bus and return 200 when the entry is not available at first but then is fetched at a later attempt', async () => {
    mockGetEntry.mockReset();
    mockGetEntry.mockRejectedValueOnce(
      new Error('The resource could not be found'),
    );
    mockGetEntry.mockResolvedValue({
      sys: {
        id: '1',
        revision: 5,
      },
      fields: {},
    } as any);

    const event = getNewsPublishContentfulPollerPayload();
    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(200);
    expect(evenBridgeMock.putEvents).toHaveBeenCalledWith({
      Entries: [
        {
          EventBusName: eventBus,
          Source: eventSource,
          DetailType: 'NewsPublished' satisfies WebhookDetailType,
          Detail: event.Records[0]!.body,
        },
      ],
    });
    expect(logger.debug).toBeCalledWith(
      expect.stringMatching(/Event added to event-bus/i),
    );
  });

  test('Should return 500 when polling fails for a reason other than the not-found error', async () => {
    const event = getNewsPublishContentfulPollerPayload();
    (
      pollContentfulDeliveryApi as jest.MockedFunction<
        typeof pollContentfulDeliveryApi
      >
    ).mockRejectedValueOnce(new Error('some error'));
    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
    expect(logger.error).toBeCalledWith(
      expect.stringMatching(/The error message\: some error/i),
    );
  });
  test('Should error when there are no records', async () => {
    const event = getNewsContentfulPollerPayload(0);
    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
    expect(logger.error).toBeCalledWith(
      expect.stringMatching(/Invalid record length. BatchSize is set to 1./i),
    );
  });
  test('Should error when there are more than 1 record', async () => {
    const event = getNewsContentfulPollerPayload(2);
    const { statusCode } = await handler(event);

    expect(statusCode).toStrictEqual(500);
    expect(logger.error).toBeCalledWith(
      expect.stringMatching(/Invalid record length. BatchSize is set to 1./i),
    );
  });
});
