import { Auth } from 'googleapis';
import 'source-map-support/register';
import { GetJWTCredentials, Logger } from '../../utils';

type Config = {
  asapApiUrl: string;
  googleApiToken: string;
  googleApiUrl: string;
  cms?: 'contentful';
};

export const subscribeToEventChangesFactory =
  (
    getJWTCredentials: GetJWTCredentials,
    logger: Logger,
    { asapApiUrl, googleApiToken, googleApiUrl, cms }: Config,
  ) =>
  async (
    calendarId: string,
    subscriptionId: string,
  ): Promise<{
    resourceId: string | null;
    expiration: number | null;
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
      address:
        cms === 'contentful'
          ? `${asapApiUrl}/webhook/events/contentful`
          : `${asapApiUrl}/webhook/events`,
      params: {
        // 30 days, which is a maximum TTL
        ttl,
      },
    };
    try {
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
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        err.code === '404'
      ) {
        logger.warn(
          `Calendar not found when subscribing to calendarId: ${calendarId}`,
        );
        return {
          resourceId: null,
          expiration: null,
        };
      }

      logger.error(
        `An error occurred subscribing to calendarId: ${calendarId}`,
      );
      if (err instanceof Error) {
        logger.error(`Error message: ${err.message}`);
      }
      throw err;
    }
  };

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

export type SubscribeToEventChanges = ReturnType<
  typeof subscribeToEventChangesFactory
>;
export type UnsubscribeFromEventChanges = ReturnType<
  typeof unsubscribeFromEventChangesFactory
>;
