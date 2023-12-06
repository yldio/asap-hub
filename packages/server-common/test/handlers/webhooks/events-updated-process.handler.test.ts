import { SyncCalendar } from '../../../src';
import { webhookEventUpdatedProcessHandlerFactory } from '../../../src/handlers/webhooks/events-updated-process.handler';
import { getListCalendarDataObject } from '../../fixtures/calendar.fixtures';
import {
  getGoogleCalenderEventPayloads,
  getGoogleCalenderEventProcessPayload,
  getGoogleCalenderEventRecord,
} from '../../fixtures/google-events.fixtures';
import { calendarDataProviderMock } from '../../mocks/calendar-data-provider.mock';
import { loggerMock as logger } from '../../mocks/logger.mock';

describe('Event Webhook', () => {
  const syncCalendarMock: jest.MockedFunction<SyncCalendar> = jest.fn();

  afterEach(jest.resetAllMocks);

  const handler = webhookEventUpdatedProcessHandlerFactory(
    calendarDataProviderMock,
    syncCalendarMock,
    logger,
  );

  test('Should return 200 and save nextSyncToken when it receives one from google', async () => {
    const listCalendarDataObject = getListCalendarDataObject();
    calendarDataProviderMock.fetch.mockResolvedValueOnce(
      getListCalendarDataObject(),
    );
    syncCalendarMock.mockResolvedValueOnce('next-sync-token-1234');
    calendarDataProviderMock.update.mockResolvedValueOnce(undefined);
    const event = getGoogleCalenderEventProcessPayload();

    await handler(event);

    expect(calendarDataProviderMock.update).toHaveBeenCalledTimes(1);
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
      listCalendarDataObject.items[0]!.id,
      {
        syncToken: 'next-sync-token-1234',
      },
    );
  });

  test('Should return 200 event when doesnt receive a syncToken', async () => {
    calendarDataProviderMock.fetch.mockResolvedValueOnce(
      getListCalendarDataObject(),
    );
    syncCalendarMock.mockResolvedValueOnce(undefined);
    calendarDataProviderMock.update.mockResolvedValueOnce(undefined);
    const event = getGoogleCalenderEventProcessPayload();

    await handler(event);

    expect(calendarDataProviderMock.update).not.toHaveBeenCalled();
  });

  test('Should return 200 even when fails to save nextSyncToken', async () => {
    const listCalendarDataObject = getListCalendarDataObject();
    calendarDataProviderMock.fetch.mockResolvedValueOnce(
      getListCalendarDataObject(),
    );
    syncCalendarMock.mockResolvedValueOnce('next-sync-token-1234');
    calendarDataProviderMock.update.mockRejectedValueOnce(
      new Error('CMS Error'),
    );

    const event = getGoogleCalenderEventProcessPayload();

    await handler(event);

    expect(calendarDataProviderMock.update).toHaveBeenCalledTimes(1);
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
      listCalendarDataObject.items[0]!.id,
      {
        syncToken: 'next-sync-token-1234',
      },
    );
  });
  test('Should error when there are no records', async () => {
    const event = getGoogleCalenderEventPayloads(0);
    await expect(handler(event)).rejects.toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/Invalid record length. BatchSize is set to 1./i),
    );
  });
  test('Should error when there are more than 1 record', async () => {
    const event = getGoogleCalenderEventPayloads(2);
    await expect(handler(event)).rejects.toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/Invalid record length. BatchSize is set to 1./i),
    );
  });

  test('Should throw when the channelId is not found', async () => {
    const { messageAttributes } = getGoogleCalenderEventRecord();
    delete messageAttributes.ChannelId;
    const event = getGoogleCalenderEventProcessPayload({
      ...getGoogleCalenderEventRecord(),
      messageAttributes,
    });

    await expect(handler(event)).rejects.toThrow();
  });
  test('Should throw when the resourceId is not found', async () => {
    const { messageAttributes } = getGoogleCalenderEventRecord();
    delete messageAttributes.ResourceId;
    const event = getGoogleCalenderEventProcessPayload({
      ...getGoogleCalenderEventRecord(),
      messageAttributes,
    });

    await expect(handler(event)).rejects.toThrow();
  });
  test('Should return 502 when fails to get calendar', async () => {
    calendarDataProviderMock.fetch.mockRejectedValueOnce(
      new Error('CMS Error'),
    );
    const event = getGoogleCalenderEventProcessPayload();

    await expect(handler(event)).rejects.toThrow();
  });

  test('Should return 500 when fails to find the calendar by resourceId', async () => {
    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [],
      total: 0,
    });
    const event = getGoogleCalenderEventProcessPayload();

    await expect(handler(event)).rejects.toThrow();
  });

  test('Should return 200 when the channel ids are different but not sync the calendar and log', async () => {
    calendarDataProviderMock.fetch.mockResolvedValueOnce(
      getListCalendarDataObject({ channelId: '42' }),
    );
    const event = getGoogleCalenderEventProcessPayload(
      getGoogleCalenderEventRecord({ channelId: '47' }),
    );

    await handler(event);

    expect(syncCalendarMock).not.toHaveBeenCalled();
    expect(calendarDataProviderMock.update).not.toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringMatching(/channel Ids do not match/i),
    );
  });
});
