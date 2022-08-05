import { FetchRemindersOptions, ListReminderDataObject } from '@asap-hub/model';

export interface ReminderDataProvider {
  fetch: (options: FetchRemindersOptions) => Promise<ListReminderDataObject>;
}
