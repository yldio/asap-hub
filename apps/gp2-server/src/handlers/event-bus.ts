import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail } from '@asap-hub/model';

export type OutputPayload = WebhookDetail<ContentfulWebhookPayload<'output'>>;
export type ProjectPayload = WebhookDetail<ContentfulWebhookPayload<'project'>>;
export type UserPayload = WebhookDetail<ContentfulWebhookPayload<'user'>>;
