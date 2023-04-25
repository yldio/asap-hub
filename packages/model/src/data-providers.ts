import {
  CalendarCreateDataObject,
  CalendarDataObject,
  CalendarUpdateDataObject,
  EventCreateDataObject,
  EventDataObject,
  EventUpdateDataObject,
  FetchEventsOptions,
  ListResponse,
} from '.';

export type FetchCalendarProviderOptions = {
  maxExpiration?: number;
  active?: boolean;
  resourceId?: string;
};

export type DataProvider<
  TDataObject = null,
  TFetchOptions = null,
  TCreateData = null,
  TCreateOptions = null,
  TUpdateData = null,
  TUpdateOptions = null,
> = {
  fetchById(id: string): Promise<TDataObject | null>;
  fetch: (options: TFetchOptions) => Promise<ListResponse<TDataObject>>;
} & (TCreateData extends null
  ? // eslint-disable-next-line @typescript-eslint/ban-types
    {}
  : {
      create(data: TCreateData, options?: TCreateOptions): Promise<string>;
    }) &
  (TUpdateData extends null
    ? // eslint-disable-next-line @typescript-eslint/ban-types
      {}
    : {
        update(
          id: string,
          data: TUpdateData,
          options?: TUpdateOptions,
        ): Promise<void>;
      });

export type CalendarDataProvider = DataProvider<
  CalendarDataObject,
  FetchCalendarProviderOptions,
  CalendarCreateDataObject,
  null,
  CalendarUpdateDataObject
>;

export type EventDataProvider = DataProvider<
  EventDataObject,
  FetchEventsOptions,
  EventCreateDataObject,
  null,
  EventUpdateDataObject
>;
