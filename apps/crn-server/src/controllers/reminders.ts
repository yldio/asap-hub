import { DateTime } from 'luxon';
import { sharedResearch, events } from '@asap-hub/routing';
import {
  EventReminderType,
  FetchRemindersOptions,
  ListReminderResponse,
} from '@asap-hub/model';
import { ReminderDataProvider } from '../data-providers/reminders.data-provider';

export interface ReminderController {
  fetch: (options: FetchRemindersOptions) => Promise<ListReminderResponse>;
}

export const formattedMaterialByEventType = (
  type: EventReminderType,
): string => {
  switch (type) {
    case 'Notes Updated':
      return 'Notes';
    case 'Video Updated':
      return 'Video(s)';
    case 'Presentation Updated':
      return 'Presentation(s)';
    default:
      return `${type.split(' ')[0]}(s)`;
  }
};

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
            description: `${reminder.data.title} ${reminder.data.documentType} from your ASAP Team is now published on the Hub. If there are errors, please let your PM know.`,
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

        if (
          reminder.entity === 'Event' &&
          ['Video Updated', 'Presentation Updated', 'Notes Updated'].includes(
            reminder.type,
          )
        ) {
          const description = `${formattedMaterialByEventType(
            reminder.type,
          )} for ${reminder.data.title} event has been shared.`;
          return {
            id: reminder.id,
            entity: reminder.entity,
            href: events({}).event({
              eventId: reminder.data.eventId,
            }).$,
            description,
          };
        }

        return {
          id: reminder.id,
          entity: reminder.entity,
          href: events({}).event({
            eventId: reminder.data.eventId,
          }).$,
          description: `${reminder.data.title} event is happening now! Click here to join the meeting!`,
        };
      }),
    };
  }
}
