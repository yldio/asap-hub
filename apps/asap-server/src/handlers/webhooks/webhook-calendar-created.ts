import AWS from 'aws-sdk';
import Joi from '@hapi/joi';
import { auth, JWTInput, JWT } from 'google-auth-library';
import { framework as lambda } from '@asap-hub/services-common';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';
import { region, googleApiCredentialsSecretId } from '../../config';
import { http } from '../../utils/instrumented-framework';

import { Handler } from '../../utils/types';
import validateRequest from '../../utils/validate-squidex-request';

export const webhookCalendarCreatedHandlerFactory = (
  subscribe: SubscribeToEventChanges,
  unsubscribe: UnsubscribeFromEventChanges,
): Handler =>
  http(
    async (request: lambda.Request): Promise<lambda.Response> => {
      await validateRequest(request);

      const bodySchema = Joi.object({
        type: Joi.string().required(),
        payload: Joi.object({
          data: Joi.object().required(),
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

      // eslint-disable-next-line no-console
      console.log('Received:', JSON.stringify(request.payload));

      if (['CalendarsCreated'].includes(event)) {
        try {
          await subscribe(payload.data.id.iv, payload.id);
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
) => async (calendarId: string, subscriptionId: string): Promise<void> => {
  const creds = await getJWTCredentials();
  const client = auth.fromJSON(creds) as JWT;

  client.scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/watch`;
  const data = {
    id: subscriptionId,
    type: 'web_hook',
    address: 'https://api-646.hub.asap.science/webhook/calendar-updates',
    params: {
      // 30 days, which is a maximum TTL
      ttl: 2592000,
    },
  };

  const response = await client.request({ url, method: 'POST', data });

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(response, null, 2));
};

export type SubscribeToEventChanges = ReturnType<
  typeof subscribeToEventChangesFactory
>;

export const unsubscribeFromEventChangesFactory = (
  getJWTCredentials: GetJWTCredentials,
) => async (resourceId: string): Promise<void> => {};

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

export type GetJWTCredentials = () => Promise<JWTInput>;

export const handler: Handler = webhookCalendarCreatedHandlerFactory(
  subscribeToEventChangesFactory(getJWTCredentials),
  unsubscribeFromEventChangesFactory(getJWTCredentials),
);
