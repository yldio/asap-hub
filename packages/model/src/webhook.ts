export type EntityEventAction = 'Published' | 'Unpublished';

export type EventEvent = `Events${EntityEventAction}`;
export type ExternalAuthorEvent = `ExternalAuthors${EntityEventAction}`;
export type InterestGroupEvent = `InterestGroups${EntityEventAction}`;
export type TeamEvent = `Teams${EntityEventAction}`;
export type ResearchOutputEvent = `ResearchOutputs${EntityEventAction}`;
export type WorkingGroupEvent = `WorkingGroups${EntityEventAction}`;
export type LabEvent = `Labs${EntityEventAction}`;
export type CalendarEvent = `Calendars${EntityEventAction}`;
export type UserEvent = `Users${EntityEventAction}`;
export type NewsEvent = `News${EntityEventAction}`;
export type TutorialEvent = `Tutorials${EntityEventAction}`;

export type WebhookDetailType =
  | CalendarEvent
  | EventEvent
  | ExternalAuthorEvent
  | InterestGroupEvent
  | LabEvent
  | NewsEvent
  | ResearchOutputEvent
  | TeamEvent
  | UserEvent
  | WorkingGroupEvent
  | TutorialEvent;

export type WebhookDetail<T extends object = object> = {
  resourceId: string;
} & T;
