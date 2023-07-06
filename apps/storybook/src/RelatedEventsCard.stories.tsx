import { createListEventResponse } from '@asap-hub/fixtures';
import { RelatedEventsCard } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Related Events Card',
};

export const Normal = () => (
  <RelatedEventsCard
    relatedEvents={createListEventResponse(number('Events', 3)).items}
    truncateFrom={number('Truncate From', 3)}
  />
);
