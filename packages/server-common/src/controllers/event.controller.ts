import {
  EventCreateRequest as DefaultEventCreateRequest,
  EventResponse as DefaultEventResponse,
  EventUpdateRequest as DefaultEventUpdateRequest,
  FetchEventsOptions,
  ListEventResponse as DefaultListEventResponse,
} from '@asap-hub/model';

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
