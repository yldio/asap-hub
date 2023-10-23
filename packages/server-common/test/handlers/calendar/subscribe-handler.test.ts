import nock from 'nock';
import {
  subscribeToEventChangesFactory,
  unsubscribeFromEventChangesFactory,
} from '../../../src';
import { GetJWTCredentials } from '../../../src/utils/aws-secret-manager';
import { googleApiAuthJWTCredentials } from '../../mocks/google-api.mock';
import { loggerMock as logger } from '../../mocks/logger.mock';
import { getCalendarCreateEvent } from './webhook-sync-calendar.fixtures';
const googleApiUrl = 'https://www.googleapis.com/';

describe('Subscription', () => {
  const calendarId = 'calendar-id';
  const getJWTCredentials: jest.MockedFunction<GetJWTCredentials> = jest.fn();
  const asapApiUrl = 'http://asap-api-url';
  const googleApiToken = 'google-api-token';

  test.each`
    cms             | address
    ${'contentful'} | ${'webhook/events/contentful'}
  `('404 - should return empty resourceId', async ({ address, cms }) => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    nock(googleApiUrl)
      .post('/oauth2/v4/token')
      .reply(404, {
        access_token: '1/8xbJqaOZXSUZbHLl5EOtu1pxz3fmmetKx9W8CV4t79M',
        scope: `${googleApiUrl}auth/prediction`,
        token_type: 'Bearer',
        expires_in: 3600,
      })
      .post(`/calendar/v3/calendars/${calendarId}/events/watch`, {
        id: getCalendarCreateEvent().payload.id,
        token: googleApiToken,
        type: 'web_hook',
        address: `${asapApiUrl}/${address}`,
        params: {
          // 30 days, which is a maximum TTL
          ttl: 2592000,
        },
      });

    const subscribeToEventChanges = subscribeToEventChangesFactory(
      getJWTCredentials,
      logger,
      { googleApiUrl, googleApiToken, asapApiUrl, cms },
    );

    const result = await subscribeToEventChanges(
      calendarId,
      getCalendarCreateEvent().payload.id,
    );

    expect(result).toEqual({
      resourceId: null,
      expiration: null,
    });
    expect(nock.isDone()).toBe(true);
  });
  test.each`
    cms             | address
    ${'squidex'}    | ${'webhook/events'}
    ${'contentful'} | ${'webhook/events/contentful'}
  `('500 - should throw', async ({ address, cms }) => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    nock(googleApiUrl)
      .post('/oauth2/v4/token')
      .reply(500, {
        access_token: '1/8xbJqaOZXSUZbHLl5EOtu1pxz3fmmetKx9W8CV4t79M',
        scope: `${googleApiUrl}auth/prediction`,
        token_type: 'Bearer',
        expires_in: 3600,
      })
      .post(`/calendar/v3/calendars/${calendarId}/events/watch`, {
        id: getCalendarCreateEvent().payload.id,
        token: googleApiToken,
        type: 'web_hook',
        address: `${asapApiUrl}/${address}`,
        params: {
          // 30 days, which is a maximum TTL
          ttl: 2592000,
        },
      });

    const subscribeToEventChanges = subscribeToEventChangesFactory(
      getJWTCredentials,
      logger,
      { googleApiUrl, googleApiToken, asapApiUrl, cms },
    );

    await expect(
      subscribeToEventChanges(calendarId, getCalendarCreateEvent().payload.id),
    ).rejects.toThrow();

    expect(nock.isDone()).toBe(true);
  });
  test.each`
    cms             | address
    ${'squidex'}    | ${'webhook/events'}
    ${'contentful'} | ${'webhook/events/contentful'}
  `(
    'Should subscribe to the calendar events notifications and return the resourceId when cms is $cms',
    async ({ address, cms }) => {
      getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

      const expiration = 1617196357000;

      nock(googleApiUrl)
        .post('/oauth2/v4/token')
        .reply(200, {
          access_token: '1/8xbJqaOZXSUZbHLl5EOtu1pxz3fmmetKx9W8CV4t79M',
          scope: `${googleApiUrl}auth/prediction`,
          token_type: 'Bearer',
          expires_in: 3600,
        })
        .post(`/calendar/v3/calendars/${calendarId}/events/watch`, {
          id: getCalendarCreateEvent().payload.id,
          token: googleApiToken,
          type: 'web_hook',
          address: `${asapApiUrl}/${address}`,
          params: {
            // 30 days, which is a maximum TTL
            ttl: 2592000,
          },
        })
        .reply(200, {
          resourceId: 'some-resource-id',
          expiration: `${expiration}`,
        });

      const subscribeToEventChanges = subscribeToEventChangesFactory(
        getJWTCredentials,
        logger,
        { googleApiUrl, googleApiToken, asapApiUrl, cms },
      );

      const result = await subscribeToEventChanges(
        calendarId,
        getCalendarCreateEvent().payload.id,
      );

      expect(result).toEqual({
        resourceId: 'some-resource-id',
        expiration,
      });
      expect(nock.isDone()).toBe(true);
    },
  );
});

describe('Unsubscribing', () => {
  const resourceId = 'resource-id';
  const channelId = 'channel-id';
  const getJWTCredentials: jest.MockedFunction<GetJWTCredentials> = jest.fn();
  const unsubscribeFromEventChanges = unsubscribeFromEventChangesFactory(
    getJWTCredentials,
    logger,
    { googleApiUrl },
  );

  test('Should unsubscribe from the calendar events notifications', async () => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    nock.cleanAll();

    nock(googleApiUrl)
      .post('/oauth2/v4/token')
      .reply(200, {
        access_token: '1/8xbJqaOZXSUZbHLl5EOtu1pxz3fmmetKx9W8CV4t79M',
        scope: `${googleApiUrl}auth/prediction`,
        token_type: 'Bearer',
        expires_in: 3600,
      })
      .post(`/calendar/v3/channels/stop`, {
        id: channelId,
        resourceId,
      })
      .reply(200, {});

    await unsubscribeFromEventChanges(resourceId, channelId);

    expect(nock.isDone()).toBe(true);
  });
});
