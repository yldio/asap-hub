import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import {
  EventEvent,
  ExternalAuthorEvent,
  GroupEvent,
  LabEvent,
  ResearchOutputEvent,
  TeamEvent,
  WebhookDetail,
  WorkingGroupEvent,
} from '@asap-hub/model';
import {
  Event,
  ExternalAuthor,
  Group,
  Lab,
  ResearchOutput,
  SquidexWebhookPayload,
  Team,
  WorkingGroup,
} from '@asap-hub/squidex';

export type EventPayload = SquidexWebhookPayload<Event, EventEvent>;

export type ExternalAuthorSquidexPayload = WebhookDetail<
  SquidexWebhookPayload<ExternalAuthor, ExternalAuthorEvent>
>;
export type ExternalAuthorContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'externalAuthors'>
>;

export type ExternalAuthorPayload =
  | ExternalAuthorSquidexPayload
  | ExternalAuthorContentfulPayload;

export type GroupPayload = SquidexWebhookPayload<Group, GroupEvent>;

export type LabPayload = SquidexWebhookPayload<Lab, LabEvent>;

export type ResearchOutputPayload = SquidexWebhookPayload<
  ResearchOutput,
  ResearchOutputEvent
>;

export type WorkingGroupPayload = SquidexWebhookPayload<
  WorkingGroup,
  WorkingGroupEvent
>;

export type TeamPayload = SquidexWebhookPayload<Team, TeamEvent>;
