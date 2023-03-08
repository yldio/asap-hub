import { ListResponse } from '../common';
import { BasicEvent } from '../event-common';
import { CalendarResponse } from './calendar';

export interface EventSpeakerUser {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  avatarUrl?: string;
}
export interface EventSpeakerExternalUser {
  name: string;
  orcid?: string;
}
export interface SpeakerInfo {
  speaker: EventSpeakerUser | EventSpeakerExternalUser | undefined;
}
export type EventSpeaker = SpeakerInfo & { topic?: string };
export interface EventDataObject extends BasicEvent {
  calendar: CalendarResponse;
  speakers: EventSpeaker[];
}

export type ListEventDataObject = ListResponse<EventDataObject>;
export type EventResponse = EventDataObject;
export type ListEventResponse = ListResponse<EventResponse>;

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

export type EventUpdateDataObject = Partial<
  Omit<EventDataObject, 'calendar'> & {
    calendar: string;
  }
>;

export type EventCreateRequest = EventCreateDataObject;
export type EventUpdateRequest = EventUpdateDataObject;
