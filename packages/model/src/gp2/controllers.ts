import {
  CalendarResponse,
  EventCreateRequest,
  EventResponse,
  EventUpdateRequest,
  ListCalendarResponse,
  ListEventResponse,
} from '.';

import {
  CalendarController as CalendarControllerBase,
  EventController as EventControllerBase,
} from '..';

export type CalendarController = CalendarControllerBase<
  CalendarResponse,
  ListCalendarResponse
>;

export type EventController = EventControllerBase<
  EventResponse,
  ListEventResponse,
  EventCreateRequest,
  EventUpdateRequest
>;

export interface UserController<T> {
  connectByCode(welcomeCode: string, userId: string): Promise<T>;
}
