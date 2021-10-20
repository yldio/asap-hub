import Boom from '@hapi/boom';
import { RestCalendar } from '@asap-hub/squidex';
import { framework as lambda } from '@asap-hub/services-common';

import { Handler } from '../../utils/types';
import { http } from '../../utils/instrumented-framework';
import Calendars, { CalendarController } from '../../controllers/calendars';
import {
  SyncCalendar,
  syncCalendarFactory,
} from '../../utils/sync-google-calendar';
import logger from '../../utils/logger';
import { googleApiToken } from '../../config';
import { syncEventFactory } from '../../utils/sync-google-event';
import Events from '../../controllers/events';
import getJWTCredentials from '../../utils/aws-secret-manager';

export const webhookEventUpdatedHandlerFactory = (
  calendars: CalendarController,
  syncCalendar: SyncCalendar,
): Handler =>
  http(async (request: lambda.Request): Promise<lambda.Response> => {
    logger.debug(JSON.stringify(request, null, 2), 'Request');

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

    let calendar: RestCalendar;

    try {
      calendar = await calendars.fetchByResourceId(resourceId);
    } catch (error) {
      logger.error(error, 'Error fetching calendar');
      throw Boom.badGateway();
    }

    const squidexCalendarId = calendar.id;
    const googleCalendarId = calendar.data.googleCalendarId.iv;
    const syncToken = calendar.data.syncToken?.iv;

    const nextSyncToken = await syncCalendar(
      googleCalendarId,
      squidexCalendarId,
      syncToken,
    );

    if (nextSyncToken) {
      await calendars
        .update(squidexCalendarId, { syncToken: nextSyncToken })
        .catch((err) => {
          logger.error(err, 'Error updating syncToken');
        });
    }

    return {
      statusCode: 200,
    };
  }, logger);

const syncCalendar = syncCalendarFactory(
  syncEventFactory(new Events()),
  getJWTCredentials,
);

export const handler: Handler = webhookEventUpdatedHandlerFactory(
  new Calendars(),
  syncCalendar,
);
