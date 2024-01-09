import {
  FetchRemindersOptions,
  DataProvider,
  gp2 as gp2Model,
} from '@asap-hub/model';

export type ReminderDataProvider = DataProvider<
  gp2Model.ReminderDataObject,
  gp2Model.ReminderDataObject,
  FetchRemindersOptions
>;
