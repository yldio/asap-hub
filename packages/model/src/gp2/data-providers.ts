import {
  CalendarDataObject,
  EventCreateDataObject,
  EventDataObject,
  EventUpdateDataObject,
  ListCalendarDataObject,
  ListEventDataObject,
} from '.';
import {
  CalendarDataProvider as CalendarDataProviderBase,
  EventDataProvider as EventDataProviderBase,
} from '..';

export type CalendarDataProvider = CalendarDataProviderBase<
  CalendarDataObject,
  ListCalendarDataObject
>;
export type EventDataProvider = EventDataProviderBase<
  EventDataObject,
  ListEventDataObject,
  EventCreateDataObject,
  EventUpdateDataObject
>;
