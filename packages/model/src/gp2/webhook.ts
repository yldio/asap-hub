import type { EntityEventAction } from '../webhook';

export type EventEvent = `Events${EntityEventAction}`;
export type OutputEvent = `Outputs${EntityEventAction}`;
export type ProjectEvent = `Projects${EntityEventAction}`;
export type UserEvent = `Users${EntityEventAction}`;
export type NewsEvent = `News${EntityEventAction}`;
export type CalendarEvent = `Calendars${EntityEventAction}`;
export type ExternalUserEvent = `ExternalUsers${EntityEventAction}`;

export type WebhookDetailType =
  | OutputEvent
  | ProjectEvent
  | EventEvent
  | UserEvent
  | NewsEvent
  | CalendarEvent
  | ExternalUserEvent;
