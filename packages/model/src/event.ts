import { CalendarResponse } from './calendar';
import { GroupResponse } from './group';
import { ListResponse } from './common';

export const MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT: number = 24;
export const EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT: number = 1;

export type EventStatus = 'Confirmed' | 'Tentative' | 'Cancelled';

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

  // These are typically added around the date when the event happens
  meetingLink?: string;
  notes?: string;

  calendar: CalendarResponse;
  groups: GroupResponse[];
}

export type ListEventResponse = ListResponse<EventResponse>;
