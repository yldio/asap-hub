import { FetchRemindersOptions, ListReminderResponse } from '@asap-hub/model';

export interface ReminderController {
  fetch: (options: FetchRemindersOptions) => Promise<ListReminderResponse>;
}

export default class Reminders implements ReminderController {
  async fetch(options: FetchRemindersOptions): Promise<ListReminderResponse> {}
}
