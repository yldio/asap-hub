import { Common, google } from 'googleapis';
import 'source-map-support/register';
import { getAuthClient, GetJWTCredentials, Logger } from '../../utils';

type Config = {
  asapApiUrl: string;
  googleApiToken: string;
};

export const subscribeToEventChangesFactory =
  (
    getJWTCredentials: GetJWTCredentials,
    logger: Logger,
    { asapApiUrl, googleApiToken }: Config,
  ) =>
  async (
    calendarId: string,
    subscriptionId: string,
  ): Promise<{
    resourceId: string | null;
    expiration: number | null;
  }> => {
    const ttl = 2_592_000; // 30 days, which is a maximum TTL
    const data = {
      calendarId,
      id: subscriptionId,
      token: googleApiToken,
      type: 'web_hook',
      address: `${asapApiUrl}/webhook/events/contentful`,
      params: {
        ttl,
      },
    };
    try {
      const auth = await getAuthClient(getJWTCredentials);
      const calendar = google.calendar({
        version: 'v3',
        auth,
      });
      const response = await calendar.events.watch(data);
      logger.debug({ response }, 'Google API subscription response');

      const {
        data: { resourceId, expiration },
      } = response;
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
  (getJWTCredentials: GetJWTCredentials, logger: Logger) =>
  async (resourceId: string, channelId: string): Promise<void> => {
    const auth = await getAuthClient(getJWTCredentials);
    const requestBody = {
      id: channelId,
      resourceId,
    };

    const calendar = google.calendar({
      version: 'v3',
      auth,
    });
    const response = await calendar.channels.stop({ requestBody });

    logger.debug({ response }, 'Google API unsubscribing response');
  };

export type SubscribeToEventChanges = ReturnType<
  typeof subscribeToEventChangesFactory
>;
export type UnsubscribeFromEventChanges = ReturnType<
  typeof unsubscribeFromEventChangesFactory
>;
