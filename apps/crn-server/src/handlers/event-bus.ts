export type SquidexEntityEvent =
  | 'Published'
  | 'Updated'
  | 'Unpublished'
  | 'Deleted';

export type CalendarEvent = `Calendars${SquidexEntityEvent}`;
export type ExternalAuthorEvent = `ExternalAuthors${SquidexEntityEvent}`;
export type LabEvent = `Labs${SquidexEntityEvent}`;
export type TeamEvent = `Teams${SquidexEntityEvent}`;
export type UserEvent = `Users${SquidexEntityEvent}`;
export type ResearchOutputEvent = `ResearchOutputs${SquidexEntityEvent}`;

export type EventBusEvent =
  | CalendarEvent
  | ExternalAuthorEvent
  | LabEvent
  | TeamEvent
  | UserEvent
  | ResearchOutputEvent;

export type LabPayload = {
  type: LabEvent;
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
