import { CalendarResponse } from './calendar';
import { GroupResponse } from './group';
import { ListResponse } from './common';

export interface EventResponse {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  calendar: CalendarResponse;
  group?: GroupResponse;
  eventLink?: string;
  lastModifiedDate: string;
}

export type ListEventResponse = ListResponse<EventResponse>;
