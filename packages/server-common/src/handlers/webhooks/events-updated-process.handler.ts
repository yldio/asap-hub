import { CalendarDataProvider, gp2 } from '@asap-hub/model';
import { SQSEvent } from 'aws-lambda';
import { Logger, SyncCalendar } from '../../utils';

export const webhookEventUpdatedProcessHandlerFactory = (
  calendarDataProvider: CalendarDataProvider | gp2.CalendarDataProvider,
  syncCalendar: SyncCalendar,
  logger: Logger,
): ((sqsEvent: SQSEvent) => Promise<{ statusCode: number }>) => {
  const getCalendar = async (resourceId: string) => {
    let calendars;
    try {
      calendars = await calendarDataProvider.fetch({
        resourceId,
      });
    } catch (error) {
      logger.error(error, 'Error fetching calendar');
      if (error instanceof Error) {
        logger.error(`The error message: ${error.message}`);
      }
      throw error;
    }
    if (!calendars.items[0]) {
      logger.error(`calendar id ${resourceId} not found.`);
      throw new Error('Calendar not found');
    }
    const [calendar] = calendars.items;
    return calendar;
  };
  return async (sqsEvent) => {
    try {
      logger.debug(JSON.stringify(sqsEvent, null, 2), 'Request');
      const record = sqsEvent.Records[0];
      if (!(record && sqsEvent.Records.length === 1)) {
        throw new Error('Invalid record length. BatchSize is set to 1.');
      }

      const resourceId = record.messageAttributes.ResourceId?.stringValue;
      const channelId = record.messageAttributes.ChannelId?.stringValue;

      if (!(resourceId && channelId)) {
        throw new Error('Invalid payload');
      }

      const calendar = await getCalendar(resourceId);

      const {
        googleCalendarId,
        id: cmsCalendarId,
        syncToken,
        channelId: currentChannelId,
      } = calendar;

      if (channelId !== currentChannelId) {
        return {
          statusCode: 200,
        };
      }
      const nextSyncToken = await syncCalendar(
        googleCalendarId,
        cmsCalendarId,
        syncToken || undefined,
      );

      if (nextSyncToken) {
        await calendarDataProvider
          .update(cmsCalendarId, { syncToken: nextSyncToken })
          .catch((err) => {
            logger.error(err, 'Error updating syncToken');
          });
      }
    } catch (err) {
      logger.error('An error occurred processing calendar');
      if (err instanceof Error) {
        logger.error(`The error message: ${err.message}`);
      }
      return {
        statusCode: 500,
      };
    }

    return {
      statusCode: 200,
    };
  };
};
