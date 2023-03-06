import {
  CalendarResponse as DefaultCalendarResponse,
  CalendarUpdateRequest,
  EventCreateRequest as DefaultEventCreateRequest,
  EventResponse as DefaultEventResponse,
  EventUpdateRequest as DefaultEventUpdateRequest,
  FetchEventsOptions,
  ListCalendarResponse as DefaultListCalendarResponse,
  ListEventResponse as DefaultListEventResponse,
} from '.';

export interface CalendarController<
  CalendarResponse = DefaultCalendarResponse,
  ListCalendarResponse = DefaultListCalendarResponse,
> {
  fetch: () => Promise<ListCalendarResponse>;
  fetchById(id: string, options?: { raw: false }): Promise<CalendarResponse>;
  update: (
    calendarId: string,
    data: CalendarUpdateRequest,
  ) => Promise<CalendarResponse>;
}

export interface EventController<
  EventResponse = DefaultEventResponse,
  ListEventResponse = DefaultListEventResponse,
  EventCreateRequest = DefaultEventCreateRequest,
  EventUpdateRequest = DefaultEventUpdateRequest,
> {
  fetch: (options: FetchEventsOptions) => Promise<ListEventResponse>;
  fetchById: (eventId: string) => Promise<EventResponse>;
  create: (event: EventCreateRequest) => Promise<EventResponse>;
  fetchByGoogleId: (googleId: string) => Promise<EventResponse | null>;
  update: (eventId: string, data: EventUpdateRequest) => Promise<EventResponse>;
}

export interface UserController<T> {
  connectByCode(welcomeCode: string, userId: string): Promise<T>;
}
