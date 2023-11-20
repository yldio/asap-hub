import { Common, google } from 'googleapis';
import 'source-map-support/register';
import { getAuthClient, GetJWTCredentials, Logger } from '../../utils';

type Config = {
  asapApiUrl: string;
  googleApiToken: string;
};
export type SubscribeToEventChanges = (
  calendarId: string,
  subscriptionId: string,
) => Promise<
  | {
      resourceId: string;
      expiration: number;
    }
  | { resourceId: null; expiration: null }
>;
export type UnsubscribeFromEventChanges = (
  resourceId: string,
  channelId: string,
) => Promise<void>;

export const subscribeToEventChangesFactory =
  (
    getJWTCredentials: GetJWTCredentials,
    logger: Logger,
    { asapApiUrl, googleApiToken }: Config,
  ): SubscribeToEventChanges =>
  async (calendarId, subscriptionId) => {
    try {
      const auth = await getAuthClient(getJWTCredentials);
      const calendar = google.calendar({
        version: 'v3',
        auth,
      });

      const {
        data: { resourceId, expiration },
      } = await calendar.events.watch({
        calendarId,
        requestBody: {
          id: subscriptionId,
          token: googleApiToken,
          address: `${asapApiUrl}/webhook/events/contentful`,
          type: 'web_hook',
          params: {
            ttl: '2592000', // 30 days, which is a maximum TTL
          },
        },
      });

      if (!(resourceId && expiration)) {
        logger.error(
          `Invalid data returned resourceId: ${resourceId} expiration: ${expiration}`,
        );
        throw new Error('Invalid data');
      }
      return {
        resourceId,
        expiration: parseInt(expiration, 10),
      };
    } catch (err: unknown) {
      if (err instanceof Common.GaxiosError && err.status === 404) {
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
  ): UnsubscribeFromEventChanges =>
  async (resourceId, channelId) => {
    const auth = await getAuthClient(getJWTCredentials);

    const calendar = google.calendar({
      version: 'v3',
      auth,
    });
    const response = await calendar.channels.stop({
      requestBody: {
        id: channelId,
        resourceId,
      },
    });

    logger.debug({ response }, 'Google API unsubscribing response');
  };
