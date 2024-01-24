import { gp2 as gp2Routing } from '@asap-hub/routing';
import { FetchRemindersOptions, gp2 as gp2Model } from '@asap-hub/model';
import { ReminderDataProvider } from '../data-providers/types';

export default class ReminderController {
  constructor(private reminderDataProvider: ReminderDataProvider) {}

  async fetch(
    options: FetchRemindersOptions,
  ): Promise<gp2Model.ListReminderResponse> {
    const reminders = await this.reminderDataProvider.fetch(options);

    return {
      total: reminders.total,
      items: reminders.items.map((reminder) => ({
        id: reminder.id,
        entity: reminder.entity,
        href: gp2Routing.outputs({}).output({
          outputId: reminder.data.outputId,
        }).$,
        description: `**${reminder.data.statusChangedBy}** in ${reminder.data.associationType} **${reminder.data.associationName}** published a **${reminder.data.documentType}** output: "${reminder.data.title}".`,
      })),
    };
  }
}
