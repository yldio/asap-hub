import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail } from '@asap-hub/model';

export type EventContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'events'>
>;

export type EventPayload = EventContentfulPayload;

export type ExternalAuthorContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'externalAuthors'>
>;

export type ExternalAuthorPayload = ExternalAuthorContentfulPayload;

export type InterestGroupContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'interestGroups'>
>;

export type InterestGroupPayload = InterestGroupContentfulPayload;

export type LabContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'labs'>
>;
export type LabPayload = LabContentfulPayload;

export type ResearchOutputContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'researchOutputs'>
>;

export type ResearchOutputPayload = ResearchOutputContentfulPayload;

export type WorkingGroupContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'workingGroups'>
>;
export type WorkingGroupPayload = WorkingGroupContentfulPayload;

export type TeamContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'teams'>
>;
export type TeamPayload = TeamContentfulPayload;

export type UserContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'users'>
>;

export type UserPayload = UserContentfulPayload;
