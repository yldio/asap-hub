import { sharedResearch } from '@asap-hub/routing';
import { FetchRemindersOptions, ListReminderResponse } from '@asap-hub/model';
import { ReminderDataProvider } from '../data-providers/reminders.data-provider';

export interface ReminderController {
  fetch: (options: FetchRemindersOptions) => Promise<ListReminderResponse>;
}

export default class Reminders implements ReminderController {
  constructor(private reminderDataProvider: ReminderDataProvider) {}

  async fetch(options: FetchRemindersOptions): Promise<ListReminderResponse> {
    const reminders = await this.reminderDataProvider.fetch(options);

    return {
      total: reminders.total,
      items: reminders.items.map((reminder) => {
        if (
          reminder.entity === 'Research Output' &&
          reminder.type === 'Published'
        ) {
          return {
            id: reminder.id,
            entity: reminder.entity,
            href: sharedResearch({}).researchOutput({
              researchOutputId: reminder.data.researchOutputId,
            }).$,
            description: `${reminder.data.title} ${reminder.data.documentType} is now published on the Hub.`,
          };
        }

        throw new TypeError(
          `Reminder type '${reminder.type}' for entity '${reminder.entity}' is not supported`,
        );
      }),
    };
  }
}
