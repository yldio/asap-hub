import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail } from '@asap-hub/model';

export type OutputPayload = WebhookDetail<ContentfulWebhookPayload<'output'>>;
