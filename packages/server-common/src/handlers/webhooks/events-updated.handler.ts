import { CalendarDataProvider, gp2 } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';
import Boom from '@hapi/boom';
import { Logger, SyncCalendar } from '../../utils';

export const webhookEventUpdatedHandlerFactory = (
  calendarDataProvider: CalendarDataProvider | gp2.CalendarDataProvider,
  syncCalendar: SyncCalendar,
  logger: Logger,
  { googleApiToken }: { googleApiToken: string },
): lambda.Handler => {
  const getCalendar = async (resourceId: string) => {
    try {
      const calendars = await calendarDataProvider.fetch({
        resourceId,
      });

      if (!calendars.items[0]) {
        throw new Error('Failed to fetch calendar by resource ID.');
      }
      const [calendar] = calendars.items;
      return calendar;
    } catch (error) {
      logger.error(error, 'Error fetching calendar');
      throw Boom.badGateway();
    }
  };
  return lambda.http(async (request) => {
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

    const calendar = await getCalendar(resourceId);

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
};
