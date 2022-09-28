import { framework as lambda } from '@asap-hub/services-common';
import {
  InputCalendar,
  RestCalendar,
  RestEvent,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { CalendarDataObject } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { Handler } from 'aws-lambda';
import { appName, baseUrl, googleApiToken } from '../../config';
import Events from '../../controllers/events';
import { getAuthToken } from '../../utils/auth';
import getJWTCredentials from '../../utils/aws-secret-manager';
import logger from '../../utils/logger';
import {
  SyncCalendar,
  syncCalendarFactory,
} from '../../utils/sync-google-calendar';
import { syncEventFactory } from '../../utils/sync-google-event';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import CalendarSquidexDataProvider, {
  CalendarDataProvider,
} from '../../data-providers/calendars.data-provider';

export const webhookEventUpdatedHandlerFactory = (
  calendarDataProvider: CalendarDataProvider,
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

    let calendar: CalendarDataObject;

    try {
      const calendars = await calendarDataProvider.fetch({
        resourceId,
      });

      if (!calendars.items[0]) {
        throw new Error('Failed to fetch calendar by resource ID.');
      }

      [calendar] = calendars.items;
    } catch (error) {
      logger.error(error, 'Error fetching calendar');
      throw Boom.badGateway();
    }

    const squidexCalendarId = calendar.id;
    const { googleCalendarId } = calendar;
    const syncToken = calendar.syncToken || undefined;

    const nextSyncToken = await syncCalendar(
      googleCalendarId,
      squidexCalendarId,
      syncToken,
    );

    if (nextSyncToken) {
      await calendarDataProvider
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
const calendarDataProvider = new CalendarSquidexDataProvider(
  calendarRestClient,
  squidexGraphqlClient,
);
const syncCalendar = syncCalendarFactory(
  syncEventFactory(new Events(squidexGraphqlClient, eventRestClient)),
  getJWTCredentials,
);

export const handler: Handler = sentryWrapper(
  webhookEventUpdatedHandlerFactory(calendarDataProvider, syncCalendar),
);
