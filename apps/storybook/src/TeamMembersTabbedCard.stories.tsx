import { TeamMembersTabbedCard } from '@asap-hub/react-components';
import { createTeamResponseMembers, teamMember } from '@asap-hub/fixtures';
import { TeamMember } from '@asap-hub/model';

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

export const MembersWithMultipleRoles = () => {
  const members: TeamMember[] = [
    {
      ...teamMember,
      id: 'member-1',
      displayName: 'Dana Lopez',
      role: 'Lead PI (Core Leadership)',
    },
    {
      ...teamMember,
      id: 'member-2',
      displayName: 'Alex Chen',
      role: 'Project Manager',
    },
    {
      ...teamMember,
      id: 'member-2',
      displayName: 'Alex Chen',
      role: 'Collaborating PI',
    },
    {
      ...teamMember,
      id: 'member-3',
      displayName: 'Maria Garcia',
      role: 'Lead PI (Core Leadership)',
    },
    {
      ...teamMember,
      id: 'member-3',
      displayName: 'Maria Garcia',
      role: 'Co-PI (Core Leadership)',
    },
    {
      ...teamMember,
      id: 'member-3',
      displayName: 'Maria Garcia',
      role: 'Collaborating PI',
    },
    {
      ...teamMember,
      id: 'member-3',
      displayName: 'Maria Garcia',
      role: 'ASAP Staff',
    },
  ];
  return (
    <TeamMembersTabbedCard
      members={members}
      title="Team Members"
      isTeamInactive={false}
    />
  );
};

export const MembersWithMultipleLabs = () => {
  const members: TeamMember[] = [
    {
      ...teamMember,
      id: 'member-1',
      displayName: 'Dana Lopez',
      role: 'Lead PI (Core Leadership)',
      labs: [{ id: 'lab-1', name: 'Bhatt' }],
    },
    {
      ...teamMember,
      id: 'member-2',
      displayName: 'Alex Chen',
      role: 'Collaborating PI',
      labs: [
        { id: 'lab-1', name: 'Bhatt' },
        { id: 'lab-2', name: 'Bhatt-Bhatt' },
        { id: 'lab-3', name: 'Anderson' },
      ],
    },
  ];
  return (
    <TeamMembersTabbedCard
      members={members}
      title="Team Members"
      isTeamInactive={false}
    />
  );
};

export const MembersWithMultipleRolesAndLabs = () => {
  const members: TeamMember[] = [
    {
      ...teamMember,
      id: 'member-1',
      displayName: 'Dana Lopez',
      role: 'Lead PI (Core Leadership)',
      labs: [{ id: 'lab-1', name: 'Bhatt' }],
    },
    {
      ...teamMember,
      id: 'member-1',
      displayName: 'Dana Lopez',
      role: 'Project Manager',
      labs: [{ id: 'lab-2', name: 'Olsen' }],
    },
    {
      ...teamMember,
      id: 'member-2',
      displayName: 'Alex Chen',
      role: 'Collaborating PI',
      labs: [{ id: 'lab-1', name: 'Bhatt' }],
    },
    {
      ...teamMember,
      id: 'member-2',
      displayName: 'Alex Chen',
      role: 'Co-PI (Core Leadership)',
      labs: [{ id: 'lab-2', name: 'Anderson' }],
    },
    {
      ...teamMember,
      id: 'member-2',
      displayName: 'Alex Chen',
      role: 'ASAP Staff',
      labs: [{ id: 'lab-3', name: 'Smith' }],
    },
    {
      ...teamMember,
      id: 'member-3',
      displayName: 'Taylor Mills',
      role: 'ASAP Staff',
      alumniSinceDate: '2024-01-01',
    },
  ];
  return (
    <TeamMembersTabbedCard
      members={members}
      title="Team Members"
      isTeamInactive={false}
    />
  );
};
