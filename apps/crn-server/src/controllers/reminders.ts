import { DateTime } from 'luxon';
import { sharedResearch, events } from '@asap-hub/routing';
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

        if (
          reminder.entity === 'Event' &&
          reminder.type === 'Happening Today'
        ) {
          const startTime = DateTime.fromISO(reminder.data.startDate)
            .setZone(options.timezone)
            .toFormat('h.mm a');

          return {
            id: reminder.id,
            entity: reminder.entity,
            href: events({}).event({
              eventId: reminder.data.eventId,
            }).$,
            description: `Today there is the ${reminder.data.title} event happening at ${startTime}.`,
          };
        }

        throw new TypeError(
          `Reminder type '${reminder.type}' for entity '${reminder.entity}' is not supported`,
        );
      }),
    };
  }
}
