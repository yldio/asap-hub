import { FetchRemindersOptions, ListReminderResponse } from '@asap-hub/model';
import { ReminderDataProvider } from '../data-providers/reminders.data-provider';

export interface ReminderController {
  fetch: (options: FetchRemindersOptions) => Promise<ListReminderResponse>;
}

export default class Reminders implements ReminderController {
  constructor(private reminderDataProvider: ReminderDataProvider) {}

  async fetch(options: FetchRemindersOptions): Promise<ListReminderResponse> {
    return this.reminderDataProvider.fetch(options);
  }
}
