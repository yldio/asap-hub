import AWS from 'aws-sdk';
import Joi from '@hapi/joi';
import { Auth } from 'googleapis';
import { framework as lambda } from '@asap-hub/services-common';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';
import {
  region,
  googleApiCredentialsSecretId,
  googleApiUrl,
  asapApiUrl,
} from '../../config';
import { http } from '../../utils/instrumented-framework';

import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';
import Calendars, { CalendarController } from '../../controllers/calendars';

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
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        }
      }

      if (['CalendarsCreated', 'CalendarsUpdated'].includes(event)) {
        try {
          const resourceId = await subscribe(payload.data.id.iv, payload.id);

          await calendarController.update(payload.id, {
            resourceId,
          });
        } catch (error) {
          return {
            statusCode: 400,
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
) => async (calendarId: string, subscriptionId: string): Promise<string> => {
  const creds = await getJWTCredentials();
  const client = Auth.auth.fromJSON(creds) as Auth.JWT;

  client.scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];
  const url = `${googleApiUrl}calendar/v3/calendars/${calendarId}/events/watch`;
  const data = {
    id: subscriptionId,
    type: 'web_hook',
    address: `${asapApiUrl}/webhook/events`,
    params: {
      // 30 days, which is a maximum TTL
      ttl: 2592000,
    },
  };

  const response = await client.request<{ resourceId: string }>({
    url,
    method: 'POST',
    data,
  });

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(response, null, 2));

  return response.data.resourceId;
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

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(response, null, 2));
};

export type UnsubscribeFromEventChanges = ReturnType<
  typeof unsubscribeFromEventChangesFactory
>;

const getJWTCredentials: GetJWTCredentials = async () => {
  const client = new AWS.SecretsManager({ region });

  const secret = await client
    .getSecretValue({ SecretId: googleApiCredentialsSecretId })
    .promise();

  if (!('SecretString' in secret) || !secret.SecretString) {
    throw new Error('Invalid credentials');
  }

  return JSON.parse(secret.SecretString);
};

export type GetJWTCredentials = () => Promise<Auth.JWTInput>;

export const handler: Handler = webhookCalendarCreatedHandlerFactory(
  subscribeToEventChangesFactory(getJWTCredentials),
  unsubscribeFromEventChangesFactory(getJWTCredentials),
  new Calendars(),
);
