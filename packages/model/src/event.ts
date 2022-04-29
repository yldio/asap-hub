import { CalendarResponse } from './calendar';
import { GroupResponse } from './group';
import { ListResponse } from './common';
import { TeamResponse } from './team';

export const MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT: number = 24;
export const EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT: number = 1;
export const EVENT_CONSIDERED_IN_PROGRESS_MINUTES_BEFORE_EVENT: number = 5;

export const eventStatus = ['Confirmed', 'Tentative', 'Cancelled'] as const;
export type EventStatus = typeof eventStatus[number];

export interface EventSpeakerUser {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  avatarUrl?: string;
}

export interface EventSpeaker {
  team: Pick<TeamResponse, 'displayName' | 'id'>;
  user?: EventSpeakerUser;
  role?: string;
}

export interface EventResponse {
  id: string;

  startDate: string;
  startDateTimeZone: string;
  endDate: string;
  endDateTimeZone: string;

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
  group?: GroupResponse;

  speakers: EventSpeaker[];
}

export type ListEventResponse = ListResponse<EventResponse>;

export const eventMaterialTypes: ReadonlyArray<
  keyof Pick<
    EventResponse,
    'notes' | 'videoRecording' | 'presentation' | 'meetingMaterials'
  >
> = ['notes', 'videoRecording', 'presentation', 'meetingMaterials'];

export const isEventStatus = (status: string | null): status is EventStatus =>
  eventStatus.includes(status as EventStatus);
