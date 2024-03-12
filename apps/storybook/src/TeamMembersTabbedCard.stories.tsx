import { TeamMembersTabbedCard } from '@asap-hub/react-components';
import { createTeamResponseMembers } from '@asap-hub/fixtures';
import { number, text, boolean } from './knobs';

export default {
  title: 'Organisms / Team Members Tabbed Card',
  component: TeamMembersTabbedCard,
};

export const Normal = () => (
  <TeamMembersTabbedCard
    members={createTeamResponseMembers({
      teamMembers: number('Number of team members', 20),
      hasLabs: true,
    })}
    title={text('Title', 'Team Members')}
    isTeamInactive={boolean('Inactive date', false)}
  />
);
