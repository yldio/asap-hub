import { RemindersCard } from '@asap-hub/react-components';
import { boolean, number } from '@storybook/addon-knobs';
import { createListReminderResponse } from '@asap-hub/fixtures';

export default {
  title: 'Organisms / Reminders Card',
  component: RemindersCard,
};

export const Normal = () => (
  <RemindersCard
    reminders={createListReminderResponse(number('Reminders', 3), {
      hasHref: boolean('has Href', true),
    }).items.map((reminder) => ({
      ...reminder,
    }))}
    limit={number('Limit', 3)}
    canPublish={boolean('User can publish', true)}
  />
);
