import { EventResponse, EventStatus, gp2 } from '@asap-hub/model';
import { calendar_v3 as calendarV3 } from 'googleapis';
import { EventController } from '../controllers/event.controller';
import {
  GoogleEvent,
  validateGoogleEvent,
} from '../validation/sync-google-event.validation';
import { Logger } from './logger';

export type SyncEvent = (
  eventPayload: calendarV3.Schema$Event,
  googleCalendarId: string,
  squidexCalendarId: string,
  defaultTimezone: string,
) => Promise<EventResponse | gp2.EventResponse>;

const getEventDate = (eventDate: calendarV3.Schema$EventDateTime): string => {
  if (eventDate.dateTime) return new Date(eventDate.dateTime).toISOString();

  return new Date(eventDate.date || 0).toISOString();
};
type EventControllerGP2 = EventController<
  gp2.EventResponse,
  gp2.ListEventResponse,
  gp2.EventCreateRequest,
  gp2.EventUpdateRequest
>;
function syncEventFactory(
  eventsController: EventController | EventControllerGP2,
  logger: Logger,
): SyncEvent {
  return async (
    eventPayload,
    googleCalendarId,
    squidexCalendarId,
    defaultTimezone,
  ) => {
    let googleEvent: GoogleEvent;
    try {
      googleEvent = validateGoogleEvent(eventPayload as GoogleEvent);
    } catch (error) {
      logger.error(error, 'Ignored event update, validation error');
      throw error;
    }

    logger.debug({ googleEvent }, 'google event');

    if (googleEvent.organizer?.email !== googleCalendarId) {
      logger.error('The calendar is not the organiser of the event');
      throw new Error('Invalid organiser');
    }

    const newEvent = {
      googleId: googleEvent.id,
      title: googleEvent.summary,
      description: googleEvent.description,
      startDate: getEventDate(googleEvent.start),
      startDateTimeZone: googleEvent.start.timeZone || defaultTimezone,
      endDate: getEventDate(googleEvent.end),
      endDateTimeZone: googleEvent.end.timeZone || defaultTimezone,
      status: (googleEvent.status.charAt(0).toUpperCase() +
        googleEvent.status.slice(1)) as EventStatus,
      calendar: squidexCalendarId,
      hidden: false,
      hideMeetingLink: false,
    };

    try {
      logger.debug('Searching for event %s', googleEvent.id);
      const existingEvent = await eventsController.fetchByGoogleId(
        googleEvent.id,
      );

      if (existingEvent) {
        if (
          newEvent.status === 'Cancelled' &&
          existingEvent.status !== 'Cancelled'
        ) {
          newEvent.hidden = true;
        } else {
          newEvent.hidden = existingEvent.hidden || false;
        }
        logger.debug(
          { id: existingEvent.id, event: newEvent },
          'Found event. Updating.',
        );
        const bob = eventsController.update(existingEvent.id, newEvent);
        return bob;
      }

      if (newEvent.status === 'Cancelled') {
        newEvent.hidden = true;
      }

      logger.info(
        { id: googleEvent.id, event: newEvent },
        'Event not found. Creating.',
      );
      return eventsController.create({ ...newEvent, tags: [] });
    } catch (err) {
      logger.error(err, 'Error syncing event');
      throw err;
    }
  };
}
export { syncEventFactory };
