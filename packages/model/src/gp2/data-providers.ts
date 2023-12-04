import {
  CalendarDataObject,
  EventCreateDataObject,
  EventDataObject,
  EventUpdateDataObject,
  FetchEventsOptions,
} from '.';
import {
  CalendarCreateDataObject,
  CalendarUpdateDataObject,
  DataProvider,
  FetchCalendarProviderOptions,
} from '..';

export type CalendarDataProvider = DataProvider<
  CalendarDataObject,
  CalendarDataObject,
  FetchCalendarProviderOptions,
  CalendarCreateDataObject,
  null,
  CalendarUpdateDataObject
>;
export type EventDataProvider = DataProvider<
  EventDataObject,
  EventDataObject,
  FetchEventsOptions,
  EventCreateDataObject,
  null,
  EventUpdateDataObject
>;
