import { FetchOptions, ListResponse } from '../common';
import { CalendarResponse } from './calendar';

export const MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT: number = 24;
export const EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT: number = 1;
export const EVENT_CONSIDERED_IN_PROGRESS_MINUTES_BEFORE_EVENT: number = 5;

export const eventStatus = ['Confirmed', 'Tentative', 'Cancelled'] as const;
export type EventStatus = typeof eventStatus[number];

export interface EventSpeakerUserData {
  alumniSinceDate?: string;
  id: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  avatarUrl?: string;
}

export type EventSpeakerUser = {
  user: EventSpeakerUserData;
};

export type EventSpeaker = EventSpeakerUser;

export type EventDataObject = {
  id: string;

  startDate: string;
  startDateTimeZone: string;
  startDateTimestamp: number;
  endDate: string;
  endDateTimeZone: string;
  endDateTimestamp: number;

  title: string;
  description?: string;
  status: EventStatus;
  lastModifiedDate: string;
  thumbnail?: string;
  tags: string[];

  // These are typically added around the date when the event happens.
  // `null` means it is not intended to add materials to the event in the future.
  notes?: string | null;
  videoRecording?: string | null;
  presentation?: string | null;
  meetingMaterials:
    | {
        title: string;
        url: string;
      }[]
    | null;
  meetingLink?: string;
  hideMeetingLink?: boolean;

  calendar: CalendarResponse;

  speakers: EventSpeaker[];
};

export type ListEventDataObject = ListResponse<EventDataObject>;
export type EventResponse = EventDataObject;
export type ListEventResponse = ListResponse<EventResponse>;

export const eventMaterialTypes: ReadonlyArray<
  keyof Pick<
    EventResponse,
    'notes' | 'videoRecording' | 'presentation' | 'meetingMaterials'
  >
> = ['notes', 'videoRecording', 'presentation', 'meetingMaterials'];

export const isEventStatus = (status: string | null): status is EventStatus =>
  eventStatus.includes(status as EventStatus);

export type EventConstraint = {
  userId?: string;
  notStatus?: string;
};

export type EventCreateDataObject = Pick<
  EventDataObject,
  | 'title'
  | 'description'
  | 'startDate'
  | 'startDateTimeZone'
  | 'endDate'
  | 'endDateTimeZone'
  | 'status'
  | 'tags'
  | 'meetingLink'
  | 'hideMeetingLink'
> & {
  googleId: string;
  calendar: string;
  hidden: boolean;
};
export type EventUpdateDataObject = Partial<EventDataObject>;

export type EventCreateRequest = EventCreateDataObject;
export type EventUpdateRequest = EventUpdateDataObject;

export type AllOrNone<T> = T | { [K in keyof T]?: never };
type SortOptions = AllOrNone<{
  sortBy: 'startDate' | 'endDate';
  sortOrder: 'asc' | 'desc';
}>;

type FilterOptions = {
  userId?: string;
  googleId?: string;
};
export type FetchEventsOptions = (
  | {
      before: string;
      after?: string;
    }
  | {
      after: string;
      before?: string;
    }
  | {
      after?: never;
      before?: never;
    }
) &
  SortOptions &
  FetchOptions<FilterOptions>;
