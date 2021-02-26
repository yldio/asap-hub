import { CalendarResponse } from './calendar';
import { GroupResponse } from './group';
import { ListResponse } from './common';

export type EventStatus = 'Confirmed' | 'Tentative' | 'Cancelled';

export interface EventResponse {
  id: string;
  title: string;
  startDate: string;
  startDateTimeZone: string;
  endDate: string;
  endDateTimeZone: string;
  description?: string;
  calendar: CalendarResponse;
  groups: GroupResponse[];
  status: EventStatus;
  meetingLink?: string;
  lastModifiedDate: string;
  tags: string[];
}

export type ListEventResponse = ListResponse<EventResponse>;
