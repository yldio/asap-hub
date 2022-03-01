import { Event, RestEvent } from '@asap-hub/squidex';
import { EventStatus } from '@asap-hub/model';
import { calendar_v3 as calendarV3 } from 'googleapis';
import { JSONSchemaType } from 'ajv';
import { EventController } from '../controllers/events';
import logger from './logger';
import { validateInput } from '../validation';
import { NullableOptionalProperties } from './types';

type GoogleEvent = NullableOptionalProperties<{
  id: string;
  summary: string;
  description: string;
  organizer: {
    email?: string;
  };
  status: string;
  start: Date;
  end: Date;
}>;

type Date = NullableOptionalProperties<{
  date?: string;
  dateTime?: string;
  timeZone?: string;
}>;

const dateSchema: JSONSchemaType<Date> = {
  type: 'object',
  properties: {
    date: { type: 'string', nullable: true },
    dateTime: { type: 'string', nullable: true },
    timeZone: { type: 'string', nullable: true },
  },
  anyOf: [{ required: ['date'] }, { required: ['dateTime'] }],
};

const googleEventValidationSchema: JSONSchemaType<GoogleEvent> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    summary: { type: 'string' },
    description: { type: 'string' },
    organizer: {
      type: 'object',
      properties: { email: { type: 'string', nullable: true } },
    },
    start: dateSchema,
    end: dateSchema,
    status: { type: 'string' },
  },
  required: ['id', 'summary', 'status'],
};

export const validateGoogleEvent = validateInput(googleEventValidationSchema, {
  skipNull: false,
  coerce: true,
});

export type SyncEvent = (
  eventPayload: calendarV3.Schema$Event,
  googleCalendarId: string,
  squidexCalendarId: string,
  defaultTimezone: string,
) => Promise<RestEvent>;

export const syncEventFactory =
  (eventsController: EventController): SyncEvent =>
  async (
    eventPayload: calendarV3.Schema$Event,
    googleCalendarId: string,
    squidexCalendarId: string,
    defaultTimezone: string,
  ): Promise<RestEvent> => {
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

    const newEvent: Omit<Event, 'tags'> = {
      googleId: googleEvent.id,
      title: googleEvent.summary,
      description: googleEvent.description,
      startDate: getEventDate(googleEvent.start),
      startDateTimeZone: googleEvent.start.timeZone || defaultTimezone,
      endDate: getEventDate(googleEvent.end),
      endDateTimeZone: googleEvent.end.timeZone || defaultTimezone,
      status: (googleEvent.status.charAt(0).toUpperCase() +
        googleEvent.status.slice(1)) as EventStatus, // TODO: use lowercase
      calendar: [squidexCalendarId],
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
          existingEvent.data.status.iv !== 'Cancelled'
        ) {
          newEvent.hidden = true;
        } else {
          newEvent.hidden = existingEvent.data.hidden?.iv || false;
        }
        logger.debug(
          { id: existingEvent.id, event: newEvent },
          'Found event. Updating.',
        );
        return await eventsController.update(existingEvent.id, newEvent);
      }

      if (newEvent.status === 'Cancelled') {
        newEvent.hidden = true;
      }

      logger.info(
        { id: googleEvent.id, event: newEvent },
        'Event not found. Creating.',
      );
      return await eventsController.create({ ...newEvent, tags: [] });
    } catch (err) {
      logger.error(err, 'Error syncing event');
      throw err;
    }
  };

const getEventDate = (eventDate: calendarV3.Schema$EventDateTime): string => {
  if (eventDate.dateTime) return new Date(eventDate.dateTime).toISOString();

  return new Date(eventDate.date || 0).toISOString();
};
