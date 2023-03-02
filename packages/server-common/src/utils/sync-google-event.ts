import { BasicEvent, EventStatus, gp2 } from '@asap-hub/model';
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
) => Promise<BasicEvent>;

const getEventDate = (eventDate: calendarV3.Schema$EventDateTime): string =>
  eventDate.dateTime
    ? new Date(eventDate.dateTime).toISOString()
    : new Date(eventDate.date || 0).toISOString();

const validateEvent = (
  eventPayload: calendarV3.Schema$Event,
  logger: Logger,
): GoogleEvent => {
  try {
    return validateGoogleEvent(eventPayload as GoogleEvent);
  } catch (error) {
    logger.error(error, 'Ignored event update, validation error');
    throw error;
  }
};
type EventControllerGP2 = EventController<
  gp2.EventResponse,
  gp2.ListEventResponse,
  gp2.EventCreateRequest,
  gp2.EventUpdateRequest
>;
export const syncEventFactory =
  (
    eventsController: EventController | EventControllerGP2,
    logger: Logger,
  ): SyncEvent =>
  async (
    eventPayload,
    googleCalendarId,
    squidexCalendarId,
    defaultTimezone,
  ) => {
    const googleEvent = validateEvent(eventPayload, logger);

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
      hideMeetingLink: false,
    };

    try {
      logger.debug('Searching for event %s', googleEvent.id);
      const existingEvent = await eventsController.fetchByGoogleId(
        googleEvent.id,
      );

      if (existingEvent) {
        const hidden =
          (newEvent.status === 'Cancelled' &&
            existingEvent.status !== 'Cancelled') ||
          existingEvent.hidden ||
          false;

        const eventToUpdate = { ...newEvent, hidden };
        logger.debug(
          { id: existingEvent.id, event: eventToUpdate },
          'Found event. Updating.',
        );
        return eventsController.update(existingEvent.id, eventToUpdate);
      }

      const eventToCreate = {
        ...newEvent,
        hidden: newEvent.status === 'Cancelled',
        tags: [],
      };
      logger.info(
        { id: googleEvent.id, event: eventToCreate },
        'Event not found. Creating.',
      );
      return eventsController.create(eventToCreate);
    } catch (err) {
      logger.error(err, 'Error syncing event');
      throw err;
    }
  };
