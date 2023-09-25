import type { EntityEventAction } from '../webhook';

export type CalendarEvent = `Calendars${EntityEventAction}`;
export type EventEvent = `Events${EntityEventAction}`;
export type ExternalUserEvent = `ExternalUsers${EntityEventAction}`;
export type NewsEvent = `News${EntityEventAction}`;
export type OutputEvent = `Outputs${EntityEventAction}`;
export type ProjectEvent = `Projects${EntityEventAction}`;
export type UserEvent = `Users${EntityEventAction}`;
export type WorkingGroupEvent = `WorkingGroups${EntityEventAction}`;

export type WebhookDetailType =
  | CalendarEvent
  | EventEvent
  | ExternalUserEvent
  | NewsEvent
  | OutputEvent
  | ProjectEvent
  | UserEvent
  | WorkingGroupEvent;
