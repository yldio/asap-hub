import {
  LabEvent,
  SquidexEntityEvent,
  UserEvent,
} from '@asap-hub/server-common';
import { RestCalendar } from '@asap-hub/squidex';

export type CalendarEvent = `Calendars${SquidexEntityEvent}`;
export type EventEvent = `Events${SquidexEntityEvent}`;
export type ExternalAuthorEvent = `ExternalAuthors${SquidexEntityEvent}`;
export type GroupEvent = `Groups${SquidexEntityEvent}`;
export type TeamEvent = `Teams${SquidexEntityEvent}`;
export type ResearchOutputEvent = `ResearchOutputs${SquidexEntityEvent}`;

export type EventBusEvent =
  | CalendarEvent
  | EventEvent
  | ExternalAuthorEvent
  | GroupEvent
  | LabEvent
  | TeamEvent
  | UserEvent
  | ResearchOutputEvent;

export type EventPayload = {
  type: EventEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
  };
};

export type ExternalAuthorPayload = {
  type: ExternalAuthorEvent;
  timestamp: string;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
    created: string;
    lastModified: string;
    version: number;
    data: { [x: string]: { iv: unknown } | null };
  };
};

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

type CalendarPayloadData = Pick<
  RestCalendar['data'],
  'googleCalendarId' | 'resourceId' | 'name' | 'color'
>;
export type CalendarPayload = {
  type: CalendarEvent;
  payload: {
    $type: 'EnrichedContentEvent';
    type: SquidexEntityEvent;
    id: string;
    data: CalendarPayloadData;
    dataOld?: CalendarPayloadData;
    version: number;
  };
};
