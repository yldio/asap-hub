export type EntityEventAction =
  | 'Created'
  | 'Published'
  | 'Updated'
  | 'Unpublished'
  | 'Deleted';

export type EventEvent = `Events${EntityEventAction}`;
export type ExternalAuthorEvent = `ExternalAuthors${EntityEventAction}`;
export type GroupEvent = `Groups${EntityEventAction}`;
export type InterestGroupEvent = `InterestGroups${EntityEventAction}`;
export type TeamEvent = `Teams${EntityEventAction}`;
export type ResearchOutputEvent = `ResearchOutputs${EntityEventAction}`;
export type WorkingGroupEvent = `WorkingGroups${EntityEventAction}`;
export type LabEvent = `Labs${EntityEventAction}`;
export type CalendarEvent = `Calendars${EntityEventAction}`;
export type UserEvent = `Users${EntityEventAction}`;
export type NewsEvent = `News${EntityEventAction}`;

export type WebhookDetailType =
  | CalendarEvent
  | EventEvent
  | ExternalAuthorEvent
  | GroupEvent
  | InterestGroupEvent
  | LabEvent
  | NewsEvent
  | TeamEvent
  | UserEvent
  | ResearchOutputEvent
  | WorkingGroupEvent;

export type WebhookDetail<T extends object = object> = {
  resourceId: string;
} & T;
