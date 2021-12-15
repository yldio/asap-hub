import 'source-map-support/register';
import { EventBridgeEvent } from 'aws-lambda';
import Joi from '@hapi/joi';
import { Auth } from 'googleapis';
import * as Sentry from '@sentry/serverless';
import { framework as lambda } from '@asap-hub/services-common';
import { WebhookPayload, Calendar, SquidexGraphql } from '@asap-hub/squidex';

import {
  googleApiUrl,
  asapApiUrl,
  googleApiToken,
  sentryDsn,
  currentRevision,
  environment,
} from '../../config';
import Calendars, { CalendarController } from '../../controllers/calendars';
import getJWTCredentialsAWS, {
  GetJWTCredentials,
} from '../../utils/aws-secret-manager';
import logger from '../../utils/logger';
import { Alerts, AlertsSentry } from '../../utils/alerts';
import { CalendarEventType } from '../webhooks/webhook-calendar';

export const calendarCreatedHandlerFactory =
  (
    subscribe: SubscribeToEventChanges,
    unsubscribe: UnsubscribeFromEventChanges,
    calendarController: CalendarController,
    alerts: Alerts,
  ) =>
  async (
    event: EventBridgeEvent<CalendarEventType, WebhookPayload<Calendar>>,
  ): Promise<'OK'> => {
    logger.debug(JSON.stringify(event, null, 2), 'Event input');

    const bodySchema = Joi.object({
      type: Joi.string().required(),
      payload: Joi.object({
        id: Joi.string().required(),
        data: Joi.object().required(),
        dataOld: Joi.object(),
      })
        .unknown()
        .required(),
    })
      .unknown()
      .required();

    const { type: eventType, payload } = lambda.validate(
      'body',
      event.detail,
      bodySchema,
    );

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

      const { version } = await calendarController.fetchById(payload.id, {
        raw: true,
      });

      if (version > (payload.version as number)) {
        logger.warn(
          `version recieved (${payload.version}) is older than current version: ${version}`,
        );
        return 'OK';
      }

      if (payload.dataOld.resourceId) {
        try {
          await unsubscribe(payload.dataOld.resourceId?.iv, payload.id);

          await calendarController.update(payload.id, {
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

        await calendarController.update(payload.id, {
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
  (getJWTCredentials: GetJWTCredentials) =>
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
  (getJWTCredentials: GetJWTCredentials) =>
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

Sentry.AWSLambda.init({
  dsn: sentryDsn,
  tracesSampleRate: 1.0,
  environment,
  release: currentRevision,
});
const squidexGraphqlClient = new SquidexGraphql();
const webhookHandler = calendarCreatedHandlerFactory(
  subscribeToEventChangesFactory(getJWTCredentialsAWS),
  unsubscribeFromEventChangesFactory(getJWTCredentialsAWS),
  new Calendars(squidexGraphqlClient),
  new AlertsSentry(Sentry.captureException.bind(Sentry)),
);

export const handler = Sentry.AWSLambda.wrapHandler(webhookHandler);

export type UnsubscribeFromEventChanges = ReturnType<
  typeof unsubscribeFromEventChangesFactory
>;

export type SquidexWebhookCalendarPayload = {
  type: 'CalendarsCreated' | 'CalendarsUpdated';
  payload: {
    $type: 'EnrichedContentEvent';
    type: 'Created' | 'Updated';
    id: string;
  };
};
