import { TeamGroupsTabbedCard } from '@asap-hub/react-components';
import { createListGroupResponse } from '@asap-hub/fixtures';
import { number, text, boolean } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Team Groups Tabbed Card',
  component: TeamGroupsTabbedCard,
};

export const Normal = () => (
  <TeamGroupsTabbedCard
    groups={createListGroupResponse(number('Groups', 3)).items}
    title={text('Title', 'Team Groups')}
    isTeamInactive={boolean('Inactive date', false)}
  />
);
