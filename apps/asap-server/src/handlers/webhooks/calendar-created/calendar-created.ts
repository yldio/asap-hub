import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';
import { Auth } from 'googleapis';

import { googleApiUrl, asapApiUrl, googleApiToken } from '../../../config';
import { http } from '../../../utils/instrumented-framework';
import { Handler } from '../../../utils/types';
import validateRequest from '../../../utils/validate-squidex-request';
import { CalendarController } from '../../../controllers/calendars';
import { GetJWTCredentials } from '../../../utils/aws-secret-manager';
import logger from '../../../utils/logger';

export const calendarCreatedHandlerFactory = (
  subscribe: SubscribeToEventChanges,
  unsubscribe: UnsubscribeFromEventChanges,
  calendarController: CalendarController,
): Handler =>
  http(async (request: lambda.Request): Promise<lambda.Response> => {
    validateRequest(request);

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

    const { payload, type: event } = lambda.validate(
      'body',
      request.payload,
      bodySchema,
    ) as WebhookPayload<Calendar>;

    logger.info(
      `Received a '${event}' event for the calendar ${payload.data.id.iv}`,
    );

    if (event === 'CalendarsUpdated') {
      if (
        !payload.dataOld ||
        !payload.dataOld.id ||
        payload.dataOld.id.iv === payload.data.id.iv
      ) {
        return {
          statusCode: 200,
          payload: payload.data.id,
        };
      }

      if (payload.dataOld.resourceId) {
        try {
          await unsubscribe(payload.dataOld.resourceId?.iv, payload.id);

          await calendarController.update(payload.id, {
            resourceId: null,
          });
        } catch (error) {
          logger.error(error, 'Error during unsubscribing from the calendar');
        }
      }
    }

    if (payload.data.id.iv === '') {
      return {
        statusCode: 200,
        payload: {
          message: 'Subscription skipped due to missing Calendar ID',
        },
      };
    }

    if (['CalendarsCreated', 'CalendarsUpdated'].includes(event)) {
      try {
        const { resourceId, expiration } = await subscribe(
          payload.data.id.iv,
          payload.id,
        );

        await calendarController.update(payload.id, {
          resourceId,
          expirationDate: expiration,
        });
      } catch (error) {
        logger.error(error, 'Error subscribing to the calendar');

        return {
          statusCode: 502,
          payload: {
            message: error.message,
          },
        };
      }

      return {
        statusCode: 200,
        payload: payload.data.id,
      };
    }

    return { statusCode: 204 };
  }, logger);

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

export type UnsubscribeFromEventChanges = ReturnType<
  typeof unsubscribeFromEventChangesFactory
>;
