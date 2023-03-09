import {
  CalendarCreateDataObject,
  CalendarDataObject as DefaultCalendarDataObject,
  CalendarUpdateDataObject,
  EventCreateDataObject as DefaultEventCreateDataObject,
  EventDataObject as DefaultEventDataObject,
  EventUpdateDataObject as DefaultEventUpdateDataObject,
  FetchEventsOptions,
  ListCalendarDataObject as DefaultListCalendarDataObject,
  ListEventDataObject as DefaultListEventDataObject,
} from '.';

export type FetchCalendarProviderOptions = {
  maxExpiration?: number;
  active?: boolean;
  resourceId?: string;
};

export interface CalendarDataProvider<
  CalendarDataObject = DefaultCalendarDataObject,
  ListCalendarDataObject = DefaultListCalendarDataObject,
> {
  create(create: CalendarCreateDataObject): Promise<string>;
  update(id: string, update: CalendarUpdateDataObject): Promise<void>;
  fetch(
    options?: FetchCalendarProviderOptions,
  ): Promise<ListCalendarDataObject>;
  fetchById(id: string): Promise<CalendarDataObject | null>;
}

export interface EventDataProvider<
  EventDataObject = DefaultEventDataObject,
  ListEventDataObject = DefaultListEventDataObject,
  EventCreateDataObject = DefaultEventCreateDataObject,
  EventUpdateDataObject = DefaultEventUpdateDataObject,
> {
  create(create: EventCreateDataObject): Promise<string>;
  update(id: string, update: EventUpdateDataObject): Promise<void>;
  fetch(options?: FetchEventsOptions): Promise<ListEventDataObject>;
  fetchById(id: string): Promise<EventDataObject | null>;
}
