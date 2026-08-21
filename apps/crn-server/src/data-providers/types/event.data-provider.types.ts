import {
  DataProvider,
  EventCreateDataObject,
  EventDataObject,
  EventUpdateDataObject,
  EventUpdateDetailsRequest,
  FetchEventsOptions,
} from '@asap-hub/model';

export type EventDataProvider = DataProvider<
  EventDataObject,
  EventDataObject,
  FetchEventsOptions,
  EventCreateDataObject,
  null,
  EventUpdateDataObject
> & {
  updateEventDetails: (
    id: string,
    data: EventUpdateDetailsRequest,
  ) => Promise<void>;
};
