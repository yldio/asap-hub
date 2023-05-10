import { getCDAClient } from '@asap-hub/contentful';
import {
  SubscribeToEventChanges,
  UnsubscribeFromEventChanges,
} from '../../../src';
import { calendarCreatedContentfulHandlerFactory } from '../../../src/handlers/calendar/subscribe-handler.contentful';
import { Alerts } from '../../../src/utils/alerts';
import { calendarDataProviderMock } from '../../mocks/calendar-data-provider.mock';
import { loggerMock as logger } from '../../mocks/logger.mock';
import {
  getCalendarContentfulEvent,
  getCalendarFromDeliveryApi,
} from './webhook-sync-calendar.fixtures';

jest.mock('@asap-hub/contentful', () => ({
  ...jest.requireActual('@asap-hub/contentful'),
  getCDAClient: jest.fn().mockReturnValue({
    getEntry: jest.fn().mockResolvedValue(null),
  }),
}));

describe('Calendar handler', () => {
  const subscribe: jest.MockedFunction<SubscribeToEventChanges> = jest.fn();
  const unsubscribe: jest.MockedFunction<UnsubscribeFromEventChanges> =
    jest.fn();
  const alerts: jest.Mocked<Alerts> = {
    error: jest.fn(),
  };

  const environment = 'environment-id';
  const space = 'space-id';
  const accessToken = 'access-token';

  const handler = calendarCreatedContentfulHandlerFactory(
    subscribe,
    unsubscribe,
    calendarDataProviderMock,
    alerts,
    logger,
    {
      environment,
      space,
      accessToken,
    },
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    test('valid: additional fields are allowed', async () => {
      const event = getCalendarContentfulEvent({});
      (event.detail as any).additionalField = 'hi';

      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      await expect(handler(event)).resolves.toBe('OK');
    });

    test('valid: additional fields in detail are allowed', async () => {
      const event = getCalendarContentfulEvent({});
      // @ts-expect-error testing unknown fields
      event.detail.additionalField = 'hi';

      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      await expect(handler(event)).resolves.toBe('OK');
    });

    test('Should throw an error and not subscribe when the payload is not valid', async () => {
      const event = getCalendarContentfulEvent({});

      // @ts-expect-error
      delete event.detail.fields;

      await expect(handler(event)).rejects.toThrow(/Validation error/);
    });

    test('Should skip any actions and return status OK for an unknown event type', async () => {
      const event = getCalendarContentfulEvent({});
      (event['detail-type'] as any) = 'some-other-type';

      const res = await handler(event);

      expect(res).toBe('OK');
      expect(subscribe).not.toHaveBeenCalled();
      expect(calendarDataProviderMock.update).not.toHaveBeenCalled();
    });
  });

  test('Should skip any actions and return status OK for an unknown event type', async () => {
    const event = getCalendarContentfulEvent({});
    (event['detail-type'] as any) = 'some-other-type';

    const res = await handler(event);

    expect(res).toBe('OK');
    expect(subscribe).not.toHaveBeenCalled();
    expect(calendarDataProviderMock.update).not.toHaveBeenCalled();
  });

  test('Should skip any actions and return status OK if calendar is not found in the cms', async () => {
    const event = getCalendarContentfulEvent({});
    (event['detail-type'] as any) = 'some-other-type';

    const res = await handler(event);

    expect(res).toBe('OK');
    expect(subscribe).not.toHaveBeenCalled();
    expect(calendarDataProviderMock.update).not.toHaveBeenCalled();
  });

  test("Should skip unsubscribe and subscribe actions and return status OK if google calendar id haven't changed", async () => {
    const event = getCalendarContentfulEvent({
      googleCalendarId: 'calendar-1',
    });

    const calendarResponse = getCalendarFromDeliveryApi({
      associatedGoogleCalendarId: 'calendar-1',
    });

    (getCDAClient as jest.Mock).mockReturnValue({
      getEntry: jest.fn().mockResolvedValue(calendarResponse),
    });

    const res = await handler(event);

    expect(res).toBe('OK');
    expect(unsubscribe).not.toHaveBeenCalled();
    expect(subscribe).not.toHaveBeenCalled();
    expect(calendarDataProviderMock.update).not.toHaveBeenCalled();
  });

  test('Should skip unsubscribe action and subscribe to calendar if there were not previous values of googleApiMetadata (calendar just created)', async () => {
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribe.mockResolvedValueOnce({ resourceId, expiration });

    const event = getCalendarContentfulEvent({
      googleCalendarId: 'calendar-1',
    });

    const calendarResponse = getCalendarFromDeliveryApi({});

    (getCDAClient as jest.Mock).mockReturnValue({
      getEntry: jest.fn().mockResolvedValue(calendarResponse),
    });

    const res = await handler(event);

    expect(res).toBe('OK');
    expect(unsubscribe).not.toHaveBeenCalled();
    expect(subscribe).toHaveBeenCalledWith('calendar-1', 'calendar-1');
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith('calendar-1', {
      expirationDate: expiration,
      resourceId,
    });
  });

  test('Should unsubscribe if google calendar id have changed and there was a previous resourceId and it should subscribe to the new google calendar', async () => {
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribe.mockResolvedValueOnce({ resourceId, expiration });

    const event = getCalendarContentfulEvent({
      googleCalendarId: 'google-calendar-2',
      resourceId: 'resource-id-1',
    });

    const calendarResponse = getCalendarFromDeliveryApi({
      googleCalendarId: 'google-calendar-2',
      associatedGoogleCalendarId: 'calendar-1',
      resourceId: 'resource-id-1',
    });

    (getCDAClient as jest.Mock).mockReturnValue({
      getEntry: jest.fn().mockResolvedValue(calendarResponse),
    });

    const res = await handler(event);

    expect(res).toBe('OK');
    expect(unsubscribe).toHaveBeenCalledWith('resource-id-1', 'calendar-1');
    expect(calendarDataProviderMock.update).toHaveBeenNthCalledWith(
      1,
      'calendar-1',
      { resourceId: null },
    );

    expect(subscribe).toHaveBeenCalledWith('google-calendar-2', 'calendar-1');

    expect(calendarDataProviderMock.update).toHaveBeenNthCalledWith(
      2,
      'calendar-1',
      { resourceId, expirationDate: expiration },
    );
  });

  test('Should unsubscribe if google calendar id have changed and there was a previous resourceId and should not subscribe if the new google calendar is empty', async () => {
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribe.mockResolvedValueOnce({ resourceId, expiration });

    const event = getCalendarContentfulEvent({
      googleCalendarId: '',
      resourceId: 'resource-id-1',
    });

    const calendarResponse = getCalendarFromDeliveryApi({
      googleCalendarId: '',
      associatedGoogleCalendarId: 'calendar-1',
      resourceId: 'resource-id-1',
    });

    (getCDAClient as jest.Mock).mockReturnValue({
      getEntry: jest.fn().mockResolvedValue(calendarResponse),
    });

    const res = await handler(event);

    expect(res).toBe('OK');
    expect(unsubscribe).toHaveBeenCalledWith('resource-id-1', 'calendar-1');
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith('calendar-1', {
      resourceId: null,
    });

    expect(subscribe).not.toHaveBeenCalled();
  });

  test('Should only subscribe to the new google calendar if google calendar id have changed and there was not a previous resourceId', async () => {
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribe.mockResolvedValueOnce({ resourceId, expiration });

    const event = getCalendarContentfulEvent({
      googleCalendarId: 'google-calendar-2',
      resourceId: 'resource-id-1',
    });

    const calendarResponse = getCalendarFromDeliveryApi({
      googleCalendarId: 'google-calendar-2',
      associatedGoogleCalendarId: 'calendar-1',
      resourceId: null,
    });

    (getCDAClient as jest.Mock).mockReturnValue({
      getEntry: jest.fn().mockResolvedValue(calendarResponse),
    });

    console.log('calendarResponse', JSON.stringify(calendarResponse, null, 2));

    const res = await handler(event);

    expect(res).toBe('OK');
    expect(unsubscribe).not.toHaveBeenCalled();

    expect(subscribe).toHaveBeenCalledWith('google-calendar-2', 'calendar-1');

    expect(calendarDataProviderMock.update).toHaveBeenCalledWith('calendar-1', {
      resourceId,
      expirationDate: expiration,
    });
  });
});
