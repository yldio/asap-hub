import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail } from '@asap-hub/model';

export type SquidexEntityEvent =
  | 'Created'
  | 'Published'
  | 'Updated'
  | 'Unpublished'
  | 'Deleted';

export type UserPayload = WebhookDetail<ContentfulWebhookPayload<'users'>>;

export type CalendarContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'calendars'>
>;

export type CalendarPayload = CalendarContentfulPayload;
