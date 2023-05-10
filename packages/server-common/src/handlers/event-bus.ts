import { CalendarEvent, UserEvent, WebhookDetail } from '@asap-hub/model';
import { SquidexWebhookPayload, User, gp2, Calendar } from '@asap-hub/squidex';
import { ContentfulWebhookPayload } from '@asap-hub/contentful';

export type SquidexEntityEvent =
  | 'Created'
  | 'Published'
  | 'Updated'
  | 'Unpublished'
  | 'Deleted';

export type UserPayload = WebhookDetail<
  | SquidexWebhookPayload<User | gp2.User, UserEvent>
  | ContentfulWebhookPayload<'users'>
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
