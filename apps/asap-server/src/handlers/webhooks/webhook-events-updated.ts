/* eslint-disable no-shadow */
import { Auth } from 'googleapis';
import Boom from '@hapi/boom';
import { framework as lambda } from '@asap-hub/services-common';

import { Handler } from '../../utils/types';
import { http } from '../../utils/instrumented-framework';
import Calendars, { CalendarController } from '../../controllers/calendars';
import Events from '../../controllers/events';
import {
  syncCalendarFactory,
  SyncCalendarFactory,
} from '../../utils/sync-google-calendar';
import { syncEventFactory } from '../../utils/sync-google-event';
import getJWTCredentials, {
  GetJWTCredentials,
} from '../../utils/aws-secret-manager';
import logger from '../../utils/logger';
import { googleApiToken } from '../../config';

export const webhookEventUpdatedHandlerFactory = (
  calendars: CalendarController,
  getJWTCredentials: GetJWTCredentials,
  syncCalendarFactory: SyncCalendarFactory,
): Handler =>
  http(
    async (request: lambda.Request): Promise<lambda.Response> => {
      const channelToken = request.headers['x-goog-channel-token'];
      if (!channelToken) {
        throw Boom.unauthorized('Missing x-goog-channel-token header');
      }
      if (channelToken !== googleApiToken) {
        throw Boom.forbidden('Channel token doesnt match');
      }

      const resourceId = request.headers['x-goog-resource-id'];
      if (!resourceId) {
        throw Boom.badRequest('Missing x-goog-resource-id header');
      }

      const calendar = await calendars
        .fetchByResouceId(resourceId)
        .catch((err) => {
          logger.error('Error fetching calendar', err);
          return undefined;
        });

      if (!calendar) {
        throw Boom.badGateway();
      }

      const squidexCalendarId = calendar.id;
      const googleCalendarId = calendar.data.id.iv;
      const syncToken = calendar.data.syncToken?.iv;

      const credentials = await getJWTCredentials().catch((err) => {
        logger.error('Error fetching AWS credentials', err);
        return undefined;
      });

      if (!credentials) {
        throw Boom.badGateway();
      }

      const auth = new Auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
        ],
      }).fromJSON(credentials) as Auth.JWT;

      const syncCalendar = syncCalendarFactory(
        syncToken,
        syncEventFactory(new Events(), squidexCalendarId),
        auth,
      );
      const nextSyncToken = await syncCalendar(googleCalendarId);

      if (nextSyncToken) {
        await calendars
          .update(squidexCalendarId, { syncToken: nextSyncToken })
          .catch((err) => {
            logger.error('Error updating syncToken', err);
          });
      }

      return {
        statusCode: 200,
      };
    },
  );

export const handler: Handler = webhookEventUpdatedHandlerFactory(
  new Calendars(),
  getJWTCredentials,
  syncCalendarFactory,
);
