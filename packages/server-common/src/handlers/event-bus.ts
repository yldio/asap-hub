import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { CalendarEvent, UserEvent, WebhookDetail } from '@asap-hub/model';
import { SquidexWebhookPayload, User, gp2, Calendar } from '@asap-hub/squidex';

export type SquidexEntityEvent =
  | 'Created'
  | 'Published'
  | 'Updated'
  | 'Unpublished'
  | 'Deleted';

export type UserPayload = SquidexWebhookPayload<User | gp2.User, UserEvent>;

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
