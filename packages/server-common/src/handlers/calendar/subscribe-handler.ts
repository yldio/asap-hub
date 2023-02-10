import { EventBridgeEvent } from 'aws-lambda';
import { Auth } from 'googleapis';
import 'source-map-support/register';
import { CalendarDataProvider } from '../../data-providers';
import { Alerts } from '../../utils';
import { GetJWTCredentials } from '../../utils/aws-secret-manager';
import { Logger } from '../../utils/logger';
import { validateBody } from '../../validation/subscribe-handler.validation';
import { CalendarEvent, CalendarPayload } from '../event-bus';

type Config = {
  asapApiUrl: string;
  googleApiToken: string;
  googleApiUrl: string;
};
export const calendarCreatedHandlerFactory =
  (
    subscribe: SubscribeToEventChanges,
    unsubscribe: UnsubscribeFromEventChanges,
    calendarDataProvider: CalendarDataProvider,
    alerts: Alerts,
    logger: Logger,
  ) =>
  async (
    event: EventBridgeEvent<CalendarEvent, CalendarPayload>,
  ): Promise<'OK'> => {
    logger.debug(JSON.stringify(event, null, 2), 'Event input');

    const { type: eventType, payload } = validateBody(event.detail as never);

    logger.info(
      `Received a '${eventType}' event for the calendar ${payload.id}`,
    );

    logger.debug(`Event payload: ${JSON.stringify(payload)}`);
    if (eventType === 'CalendarsUpdated') {
      if (
        !payload.dataOld ||
        !payload.dataOld.googleCalendarId ||
        payload.dataOld.googleCalendarId.iv === payload.data.googleCalendarId.iv
      ) {
        return 'OK';
      }

      const result = await calendarDataProvider.fetchById(payload.id);

      if (!result) {
        logger.error('Failed to retrieve calendar by ID.');

        return 'OK';
      }

      const { version } = result;

      if (version > (payload.version as number)) {
        logger.warn(
          `version recieved (${payload.version}) is older than current version: ${version}`,
        );
        return 'OK';
      }

      if (payload.dataOld.resourceId) {
        try {
          await unsubscribe(payload.dataOld.resourceId?.iv, payload.id);

          await calendarDataProvider.update(payload.id, {
            resourceId: null,
          });
        } catch (error) {
          logger.error(error, 'Error during unsubscribing from the calendar');
          alerts.error(error);
        }
      }
    }

    if (payload.data.googleCalendarId.iv === '') {
      return 'OK';
    }

    if (['CalendarsCreated', 'CalendarsUpdated'].includes(eventType)) {
      try {
        const { resourceId, expiration } = await subscribe(
          payload.data.googleCalendarId.iv,
          payload.id,
        );

        await calendarDataProvider.update(payload.id, {
          resourceId,
          expirationDate: expiration,
        });
      } catch (error) {
        logger.error(error, 'Error subscribing to the calendar');
        alerts.error(error);

        throw error;
      }

      return 'OK';
    }

    return 'OK';
  };

export const subscribeToEventChangesFactory =
  (
    getJWTCredentials: GetJWTCredentials,
    logger: Logger,
    { asapApiUrl, googleApiToken, googleApiUrl }: Config,
  ) =>
  async (
    calendarId: string,
    subscriptionId: string,
  ): Promise<{
    resourceId: string;
    expiration: number;
  }> => {
    const creds = await getJWTCredentials();
    const client = Auth.auth.fromJSON(creds) as Auth.JWT;

    client.scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];
    const url = `${googleApiUrl}calendar/v3/calendars/${calendarId}/events/watch`;
    const ttl = 2592000; // 30 days
    const data = {
      id: subscriptionId,
      token: googleApiToken,
      type: 'web_hook',
      address: `${asapApiUrl}/webhook/events`,
      params: {
        // 30 days, which is a maximum TTL
        ttl,
      },
    };

    const response = await client.request<{
      resourceId: string;
      expiration: string;
    }>({
      url,
      method: 'POST',
      data,
    });

    logger.debug({ response }, 'Google API subscription response');

    return {
      resourceId: response.data.resourceId,
      expiration: parseInt(response.data.expiration, 10),
    };
  };

export type SubscribeToEventChanges = ReturnType<
  typeof subscribeToEventChangesFactory
>;

export const unsubscribeFromEventChangesFactory =
  (
    getJWTCredentials: GetJWTCredentials,
    logger: Logger,
    { googleApiUrl }: Pick<Config, 'googleApiUrl'>,
  ) =>
  async (resourceId: string, channelId: string): Promise<void> => {
    const creds = await getJWTCredentials();
    const client = Auth.auth.fromJSON(creds) as Auth.JWT;

    client.scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];
    const url = `${googleApiUrl}calendar/v3/channels/stop`;
    const data = {
      id: channelId,
      resourceId,
    };

    const response = await client.request({ url, method: 'POST', data });

    logger.debug({ response }, 'Google API unsubscribing response');
  };

export type UnsubscribeFromEventChanges = ReturnType<
  typeof unsubscribeFromEventChangesFactory
>;
