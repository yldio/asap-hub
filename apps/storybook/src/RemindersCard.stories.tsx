import { RemindersCard } from '@asap-hub/react-components';
import { createListReminderResponse } from '@asap-hub/fixtures';

import { boolean, number } from './knobs';

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
