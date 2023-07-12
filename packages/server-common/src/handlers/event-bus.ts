import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { CalendarEvent, UserEvent, WebhookDetail } from '@asap-hub/model';
import { Calendar, SquidexWebhookPayload, User } from '@asap-hub/squidex';

export type SquidexEntityEvent =
  | 'Created'
  | 'Published'
  | 'Updated'
  | 'Unpublished'
  | 'Deleted';

export type UserPayload = WebhookDetail<
  SquidexWebhookPayload<User, UserEvent> | ContentfulWebhookPayload<'users'>
>;

export type CalendarSquidexPayload = SquidexWebhookPayload<
  Calendar,
  CalendarEvent
>;

export type CalendarContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'calendars'>
>;

export type CalendarPayload =
  | CalendarSquidexPayload
  | CalendarContentfulPayload;
