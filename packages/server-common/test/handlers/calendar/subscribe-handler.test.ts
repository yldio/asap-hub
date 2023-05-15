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
  const cms = 'squidex';
  const subscribeToEventChanges = subscribeToEventChangesFactory(
    getJWTCredentials,
    logger,
    { googleApiUrl, googleApiToken, asapApiUrl, cms },
  );

  test.each`
    cms             | address
    ${'squidex'}    | ${'webhook/events'}
    ${'contentful'} | ${'webhook/events/contentful'}
  `(
    'Should subscribe to the calendar events notifications and return the resourceId when cms is $cms',
    async ({ address }) => {
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

    if (!nock.isDone()) {
      console.error('pending mocks: %j', nock.pendingMocks());
    }

    expect(nock.isDone()).toBe(true);
  });
});
