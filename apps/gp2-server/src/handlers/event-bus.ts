import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail } from '@asap-hub/model';

export type CalendarPayload = WebhookDetail<
  ContentfulWebhookPayload<'calendar'>
>;
export type EventPayload = WebhookDetail<ContentfulWebhookPayload<'event'>>;
export type ExternalUserPayload = WebhookDetail<
  ContentfulWebhookPayload<'externalUser'>
>;
export type NewsPayload = WebhookDetail<ContentfulWebhookPayload<'news'>>;
export type OutputPayload = WebhookDetail<ContentfulWebhookPayload<'output'>>;
export type ProjectPayload = WebhookDetail<ContentfulWebhookPayload<'project'>>;
export type UserPayload = WebhookDetail<ContentfulWebhookPayload<'user'>>;
export type WorkingGroupPayload = WebhookDetail<
  ContentfulWebhookPayload<'workingGroup'>
>;
