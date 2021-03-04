/* eslint-disable no-shadow */
import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';
import { Auth } from 'googleapis';

import { googleApiUrl, asapApiUrl, googleApiToken } from '../../config';
import { http } from '../../utils/instrumented-framework';
import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';
import Calendars, { CalendarController } from '../../controllers/calendars';
import getJWTCredentials, {
  GetJWTCredentials,
} from '../../utils/aws-secret-manager';
import logger from '../../utils/logger';

export const webhookCalendarCreatedHandlerFactory = (
  subscribe: SubscribeToEventChanges,
  unsubscribe: UnsubscribeFromEventChanges,
  calendarController: CalendarController,
): Handler =>
  http(
    async (request: lambda.Request): Promise<lambda.Response> => {
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
            logger('Error during unsubscribing from the calendar', error);
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
    },
  );

export const subscribeToEventChangesFactory = (
  getJWTCredentials: GetJWTCredentials,
) => async (
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
  const ttl = 2592000;
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

  logger('Google API subscription response', JSON.stringify(response, null, 2));

  return {
    resourceId: response.data.resourceId,
    expiration: parseInt(response.data.expiration, 10),
  };
};

export type SubscribeToEventChanges = ReturnType<
  typeof subscribeToEventChangesFactory
>;

export const unsubscribeFromEventChangesFactory = (
  getJWTCredentials: GetJWTCredentials,
) => async (resourceId: string, channelId: string): Promise<void> => {
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

  logger(
    'Google API unsubscribing response',
    JSON.stringify(response, null, 2),
  );
};

export type UnsubscribeFromEventChanges = ReturnType<
  typeof unsubscribeFromEventChangesFactory
>;

export const handler: Handler = webhookCalendarCreatedHandlerFactory(
  subscribeToEventChangesFactory(getJWTCredentials),
  unsubscribeFromEventChangesFactory(getJWTCredentials),
  new Calendars(),
);
