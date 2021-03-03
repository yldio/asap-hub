import Joi from '@hapi/joi';
import { RestEvent, Event } from '@asap-hub/squidex';
import { EventStatus } from '@asap-hub/model';
import { calendar_v3 as calendarV3 } from 'googleapis';
import { EventController } from '../controllers/events';
import logger from './logger';

export const syncEventFactory = (
  eventsController: EventController,
  calendarId: string,
): ((
  eventPayload: calendarV3.Schema$Event,
  defaultTimezone: string,
) => Promise<RestEvent>) => {
  const syncEvent = async (
    eventPayload: calendarV3.Schema$Event,
    defaultTimezone: string,
  ): Promise<RestEvent> => {
    const schema = Joi.object({
      id: Joi.string().required(),
      summary: Joi.string().required(),
      description: Joi.string(),
      status: Joi.string().required(),
      start: Joi.object({
        date: Joi.string(),
        dateTime: Joi.string(),
        timeZone: Joi.string(),
      }).or('date', 'dateTime'),
      end: Joi.object({
        date: Joi.string(),
        dateTime: Joi.string(),
        timeZone: Joi.string(),
      }).or('date', 'dateTime'),
    }).unknown();

    const { error, value } = schema.validate(eventPayload);

    if (error) {
      logger('Ignored event update, validation error:', error);
      return Promise.reject(new Error('Invalid event body format received'));
    }

    const googleEvent = value as GoogleEvent;
    logger('google event', googleEvent);

    const getEventDate = (
      eventDate: calendarV3.Schema$EventDateTime,
    ): string => {
      if (eventDate.dateTime) return new Date(eventDate.dateTime).toISOString();

      return new Date(eventDate.date || 0).toISOString();
    };

    const squidexEvent: Omit<Event, 'tags'> = {
      googleId: googleEvent.id,
      title: googleEvent.summary,
      description: googleEvent.description,
      startDate: getEventDate(googleEvent.start),
      startDateTimeZone: googleEvent.start.timeZone || defaultTimezone,
      endDate: getEventDate(googleEvent.end),
      endDateTimeZone: googleEvent.end.timeZone || defaultTimezone,
      status: (googleEvent.status.charAt(0).toUpperCase() +
        googleEvent.status.slice(1)) as EventStatus, // TODO: use lowercase
      calendar: [calendarId],
    };

    try {
      logger('Searching for event: ', googleEvent.id);
      const event = await eventsController.fetchByGoogleId(googleEvent.id);

      if (event) {
        logger('Found event. Updating.', event.id, squidexEvent);
        return await eventsController.update(event.id, squidexEvent);
      }

      logger('Event not found. Creating.', googleEvent.id, squidexEvent);
      return await eventsController.create({ ...squidexEvent, tags: [] });
    } catch (err) {
      logger('Error syncing event:', err);
      throw err;
    }
  };

  return syncEvent;
};

type GoogleEvent = {
  id: string;
  summary: string;
  description?: string;
  status: EventStatus;
  start: calendarV3.Schema$EventDateTime;
  end: calendarV3.Schema$EventDateTime;
};
