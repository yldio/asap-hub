import {
  CalendarCreateDataObject,
  CalendarDataObject,
  CalendarUpdateDataObject,
  ListCalendarDataObject,
} from '@asap-hub/model';

export type FetchCalendarProviderOptions = {
  maxExpiration?: number;
  active?: boolean;
  resourceId?: string;
};

export interface CalendarDataProvider {
  create(create: CalendarCreateDataObject): Promise<string>;
  update(id: string, update: CalendarUpdateDataObject): Promise<void>;
  fetch(
    options?: FetchCalendarProviderOptions,
  ): Promise<ListCalendarDataObject>;
  fetchById(id: string): Promise<CalendarDataObject | null>;
}
