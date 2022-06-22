import { framework as lambda } from '@asap-hub/services-common';
import {
  InputCalendar,
  RestCalendar,
  RestEvent,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import Boom from '@hapi/boom';
import { appName, baseUrl, googleApiToken } from '../../config';
import Calendars, { CalendarController } from '../../controllers/calendars';
import Events from '../../controllers/events';
import { getAuthToken } from '../../utils/auth';
import getJWTCredentials from '../../utils/aws-secret-manager';
import logger from '../../utils/logger';
import {
  SyncCalendar,
  syncCalendarFactory,
} from '../../utils/sync-google-calendar';
import { syncEventFactory } from '../../utils/sync-google-event';

export const webhookEventUpdatedHandlerFactory = (
  calendars: CalendarController,
  syncCalendar: SyncCalendar,
): lambda.Handler =>
  lambda.http(async (request) => {
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
  });

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const eventRestClient = new SquidexRest<RestEvent>(getAuthToken, 'events', {
  appName,
  baseUrl,
});
const calendarRestClient = new SquidexRest<RestCalendar, InputCalendar>(
  getAuthToken,
  'calendars',
  { appName, baseUrl },
);
const calendarController = new Calendars(
  squidexGraphqlClient,
  calendarRestClient,
);
const syncCalendar = syncCalendarFactory(
  syncEventFactory(new Events(squidexGraphqlClient, eventRestClient)),
  getJWTCredentials,
);

export const handler: lambda.Handler = webhookEventUpdatedHandlerFactory(
  calendarController,
  syncCalendar,
);
