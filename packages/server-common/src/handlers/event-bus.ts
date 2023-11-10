import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail } from '@asap-hub/model';

export type TeamPayload = WebhookDetail<ContentfulWebhookPayload<'teams'>>;

export type UserPayload = WebhookDetail<ContentfulWebhookPayload<'users'>>;

export type CalendarContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'calendars'>
>;

export type CalendarPayload = CalendarContentfulPayload;
