/* eslint-disable no-shadow */
import { calendar_v3 as calendarV3, Auth } from 'googleapis';
import { framework as lambda } from '@asap-hub/services-common';

import { Handler } from '../../utils/types';
import { http } from '../../utils/instrumented-framework';
import Calendars, { CalendarController } from '../../controllers/calendars';
import {
  syncCalendarFactory,
  SyncCalendarFactory,
} from '../../utils/sync-google-calendar';
import getJWTCredentials, {
  GetJWTCredentials,
} from '../../utils/aws-secret-manager';
import logger from '../../utils/logger';

export const webhookEventUpdatedHandlerFactory = (
  calendars: CalendarController,
  getJWTCredentials: GetJWTCredentials,
  syncCalendarFactory: SyncCalendarFactory,
): Handler =>
  http(
    async (request: lambda.Request): Promise<lambda.Response> => {
      // TODO: validate google request auth

      const resourceId = request.headers['x-goog-resource-id'];
      if (!resourceId) {
        return {
          statusCode: 400,
          payload: {
            message: 'Missing x-goog-resource-id header',
          },
        };
      }

      const calendar = await calendars
        .fetchByResouceId(resourceId)
        .catch((err) => {
          logger('Error fetching calendar', err);
          return undefined;
        });

      if (!calendar?.id) {
        return { statusCode: 502 };
      }
      const squidexCalendarId = calendar.id;
      const googleCalendarId = calendar.data.id.iv;

      const syncToken = await calendars
        .getSyncToken(squidexCalendarId)
        .catch((err) => {
          logger('Error fetching syncToken', err);
          return undefined;
        });

      const credentials = await getJWTCredentials().catch((err) => {
        logger('Error fetching AWS credentials', err);
        return undefined;
      });

      if (!credentials) {
        return { statusCode: 502 };
      }

      const auth = new Auth.GoogleAuth({
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
        ],
      }).fromJSON(credentials) as Auth.JWT;

      const syncCalendar = syncCalendarFactory(
        syncToken,
        syncEventFactory(squidexCalendarId),
        auth,
      );
      const nextSyncToken = await syncCalendar(googleCalendarId);

      if (nextSyncToken) {
        await calendars
          .update(squidexCalendarId, { syncToken: nextSyncToken })
          .catch((err) => {
            logger('Error updated syncToken', err);
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

const syncEventFactory = (calendarId: string) => {
  /* istanbul ignore next */
  const syncEvent = async (event: calendarV3.Schema$Event): Promise<void> => {
    logger('Request received', JSON.stringify({ calendarId, event }, null, 2));
  };
  return syncEvent;
};
