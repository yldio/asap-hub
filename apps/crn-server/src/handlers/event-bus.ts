import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import {
  EventEvent,
  ExternalAuthorEvent,
  GroupEvent,
  LabEvent,
  ResearchOutputEvent,
  TeamEvent,
  UserEvent,
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
  User,
  WorkingGroup,
} from '@asap-hub/squidex';

export type EventSquidexPayload = WebhookDetail<
  SquidexWebhookPayload<Event, EventEvent>
>;
export type EventContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'events'>
>;

export type EventPayload = EventSquidexPayload | EventContentfulPayload;

export type ExternalAuthorSquidexPayload = WebhookDetail<
  SquidexWebhookPayload<ExternalAuthor, ExternalAuthorEvent>
>;
export type ExternalAuthorContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'externalAuthors'>
>;

export type ExternalAuthorPayload =
  | ExternalAuthorSquidexPayload
  | ExternalAuthorContentfulPayload;

export type InterestGroupSquidexPayload = WebhookDetail<
  SquidexWebhookPayload<Group, GroupEvent>
>;

export type InterestGroupContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'interestGroups'>
>;

export type InterestGroupPayload =
  | InterestGroupSquidexPayload
  | InterestGroupContentfulPayload;

export type LabSquidexPayload = WebhookDetail<
  SquidexWebhookPayload<Lab, LabEvent>
>;
export type LabContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'labs'>
>;
export type LabPayload = LabSquidexPayload | LabContentfulPayload;

export type ResearchOutputSquidexPayload = WebhookDetail<
  SquidexWebhookPayload<ResearchOutput, ResearchOutputEvent>
>;
export type ResearchOutputContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'researchOutputs'>
>;

export type ResearchOutputPayload =
  | ResearchOutputSquidexPayload
  | ResearchOutputContentfulPayload;

export type WorkingGroupSquidexPayload = WebhookDetail<
  SquidexWebhookPayload<WorkingGroup, WorkingGroupEvent>
>;

export type WorkingGroupContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'workingGroups'>
>;
export type WorkingGroupPayload =
  | WorkingGroupSquidexPayload
  | WorkingGroupContentfulPayload;

export type TeamSquidexPayload = WebhookDetail<
  SquidexWebhookPayload<Team, TeamEvent>
>;
export type TeamContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'teams'>
>;
export type TeamPayload = TeamSquidexPayload | TeamContentfulPayload;

export type UserSquidexPayload = WebhookDetail<
  SquidexWebhookPayload<User, UserEvent>
>;
export type UserContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'users'>
>;

export type UserPayload = UserSquidexPayload | UserContentfulPayload;
