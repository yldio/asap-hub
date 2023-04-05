import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail } from '@asap-hub/model';
import {
  CalendarEvent,
  LabEvent,
  SquidexEntityEvent,
  UserEvent,
} from '@asap-hub/server-common';
import { ExternalAuthor, SquidexWebhookPayload } from '@asap-hub/squidex';

export type EventEvent = `Events${SquidexEntityEvent}`;
export type ExternalAuthorEvent = `ExternalAuthors${SquidexEntityEvent}`;
export type GroupEvent = `Groups${SquidexEntityEvent}`;
export type TeamEvent = `Teams${SquidexEntityEvent}`;
export type ResearchOutputEvent = `ResearchOutputs${SquidexEntityEvent}`;
export type WorkingGroupEvent = `WorkingGroups${SquidexEntityEvent}`;

export type EventBusEvent =
  | CalendarEvent
  | EventEvent
  | ExternalAuthorEvent
  | GroupEvent
  | LabEvent
  | TeamEvent
  | UserEvent
  | ResearchOutputEvent
  | WorkingGroupEvent;

export type EventPayload = {
  type: EventEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
  };
};

export type ExternalAuthorSquidexPayload = WebhookDetail<
  SquidexWebhookPayload<ExternalAuthor, ExternalAuthorEvent>
>;
export type ExternalAuthorContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'externalAuthors'>
>;

export type ExternalAuthorPayload =
  | ExternalAuthorSquidexPayload
  | ExternalAuthorContentfulPayload;

export type GroupPayload = {
  type: GroupEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
  };
};

export type LabPayload = {
  type: LabEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
  };
};

export type ResearchOutputPayload = {
  type: ResearchOutputEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
  };
};

export type WorkingGroupDeliverable = {
  description: string;
  status: string;
};

export type WorkingGroupPayload = {
  type: WorkingGroupEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
    data: {
      title: { iv: string };
      complete: { iv: boolean };
      deliverables: { iv: WorkingGroupDeliverable[] };
    };
  };
};

export type TeamPayload = {
  type: TeamEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
    data: {
      outputs: { iv: string[] };
    };
    dataOld?: {
      outputs: { iv: string[] };
    };
  };
};
