import Joi from '@hapi/joi';
import { EventStatus } from '@asap-hub/model';
import { calendar_v3 as calendarV3 } from 'googleapis';
import { EventController } from '../controllers/events';
import logger from './logger';

export const syncEventFactory = (
  eventsController: EventController,
  calendarId: string,
): ((
  event: calendarV3.Schema$Event,
  defaultTimezone: string,
) => Promise<void>) => {
  const syncEvent = async (
    event: calendarV3.Schema$Event,
    defaultTimezone: string,
  ): Promise<void> => {
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

    const { error, value } = schema.validate(event);

    if (error) {
      logger('Ignored event update, validation error:', error);
      return Promise.resolve();
    }

    const googleEvent = value as GoogleEvent;
    console.log('google event', googleEvent);

    const squidexEvent = {
      title: googleEvent.summary,
      description: googleEvent.description,
      startDate:
        googleEvent.start.dateTime ||
        new Date(googleEvent.start.date || 0).toISOString(),
      startDateTimeZone: googleEvent.start.timeZone || defaultTimezone,
      endDate:
        googleEvent.end.dateTime ||
        new Date(googleEvent.end.date || 0).toISOString(),
      endDateTimeZone: googleEvent.end.timeZone || defaultTimezone,
      status: (googleEvent.status.charAt(0).toUpperCase() +
        googleEvent.status.slice(1)) as EventStatus,
      calendar: [calendarId],
      tags: [],
    };
    console.log('squidex payload', googleEvent.id, squidexEvent);

    return eventsController.upsert(googleEvent.id, squidexEvent);
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
