import {
  FetchRemindersOptions,
  ReminderDataObject,
  DataProvider,
} from '@asap-hub/model';

export type ReminderDataProvider = DataProvider<
  ReminderDataObject,
  FetchRemindersOptions
>;
