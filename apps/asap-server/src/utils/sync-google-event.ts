import Joi from '@hapi/joi';
import { RestEvent } from '@asap-hub/squidex';
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
      logger.error(error, 'Ignored event update, validation error');
      return Promise.reject(error);
    }

    const googleEvent = value as GoogleEvent;
    logger.debug({ googleEvent }, 'google event');

    const getEventDate = (
      eventDate: calendarV3.Schema$EventDateTime,
    ): string => {
      if (eventDate.dateTime) return new Date(eventDate.dateTime).toISOString();

      return new Date(eventDate.date || 0).toISOString();
    };

    const newEvent = {
      googleId: googleEvent.id,
      title: googleEvent.summary,
      description: googleEvent.description,
      startDate: getEventDate(googleEvent.start),
      startDateTimeZone: googleEvent.start.timeZone || defaultTimezone,
      endDate: getEventDate(googleEvent.end),
      endDateTimeZone: googleEvent.end.timeZone || defaultTimezone,
      status: (googleEvent.status.charAt(0).toUpperCase() +
        googleEvent.status.slice(1)) as EventStatus, // TODO: use lowercase

      hidden: false,
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
      return await eventsController.create({
        ...newEvent,
        calendar: [calendarId],
        tags: [],
      });
    } catch (err) {
      logger.error(err, 'Error syncing event');
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
