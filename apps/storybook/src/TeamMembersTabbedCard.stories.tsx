import { TeamMembersTabbedCard } from '@asap-hub/react-components';
import { createTeamResponseMembers } from '@asap-hub/fixtures';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Team Members Tabbed Card',
  component: TeamMembersTabbedCard,
};

export const Normal = () => (
  <TeamMembersTabbedCard
    members={createTeamResponseMembers({ teamMembers: 9 })}
    title={text('Title', 'Team Members')}
  />
);
