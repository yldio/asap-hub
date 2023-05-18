import { DateTime } from 'luxon';
import { sharedResearch, events, network } from '@asap-hub/routing';
import {
  EventReminderType,
  FetchRemindersOptions,
  ListReminderResponse,
} from '@asap-hub/model';
import { ReminderDataProvider } from '../data-providers/reminders.data-provider';
import { crnMeetingMaterialsDrive } from '../config';

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
      throw new Error('Unknown Material Event');
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
          reminder.entity === 'Research Output' &&
          reminder.type === 'Draft' &&
          (reminder.data.associationType === 'working group' ||
            reminder.data.associationType === 'team')
        ) {
          return {
            id: reminder.id,
            entity: reminder.entity,
            href: sharedResearch({}).researchOutput({
              researchOutputId: reminder.data.researchOutputId,
            }).$,
            description: `created a draft output for`,
            publisherName: reminder.data.createdBy,
            associationName: reminder.data.associationName,
            entityTitle: reminder.data.title,
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
          reminder.type === 'Share Presentation'
        ) {
          const href = reminder.data.pmId
            ? network({}).users({}).user({ userId: reminder.data.pmId }).$
            : events({}).event({
                eventId: reminder.data.eventId,
              }).$;
          return {
            id: reminder.id,
            entity: reminder.entity,
            href,
            description: `Don't forget to share your presentation for the ${reminder.data.title} event with your Project Manager.`,
          };
        }

        if (
          reminder.entity === 'Event' &&
          reminder.type === 'Publish Material'
        ) {
          return {
            id: reminder.id,
            entity: reminder.entity,
            description: `It's time to publish the meeting materials for the ${reminder.data.title} event.`,
          };
        }

        if (
          reminder.entity === 'Event' &&
          reminder.type === 'Upload Presentation'
        ) {
          return {
            id: reminder.id,
            entity: reminder.entity,
            href: crnMeetingMaterialsDrive,
            description: `Don't forget to upload presentations for the ${reminder.data.title} event in the ASAP CRN Meeting Materials Drive.`,
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
