import { TeamTabbedGroupsCard } from '@asap-hub/react-components';
import { createListGroupResponse } from '@asap-hub/fixtures';
import { number, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Team Tabbed Groups Card',
  component: TeamTabbedGroupsCard,
};

export const Normal = () => (
  <TeamTabbedGroupsCard
    groups={createListGroupResponse(number('Groups', 3)).items}
    title={text('Title', 'Team Groups')}
    inactive={text('Inactive date', '')}
  />
);
