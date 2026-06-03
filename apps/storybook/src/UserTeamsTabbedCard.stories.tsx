import { ComponentProps } from 'react';
import { teamRole } from '@asap-hub/model';
import { UserTeamsTabbedCard } from '@asap-hub/react-components';

import { boolean, number } from './knobs';

export default {
  title: 'Organisms / User Teams Tabbed Card',
};

export const Normal = () => {
  const props: ComponentProps<typeof UserTeamsTabbedCard> = {
    userAlumni: boolean('User alumni?', false),
    teams: Array.from({ length: number('Number of teams', 4) }).map(
      (_, index) => ({
        id: `${index + 1}`,
        displayName: `Team ${index + 1}`,
        role: teamRole[index] || teamRole[0],
        teamInactiveSince: index === 0 ? new Date().toISOString() : '',
        inactiveSinceDate: index === 1 ? new Date().toISOString() : '',
      }),
    ),
  };

  return <UserTeamsTabbedCard {...props} />;
};

export const MultipleRolesPerTeam = () => {
  const props: ComponentProps<typeof UserTeamsTabbedCard> = {
    userAlumni: false,
    teams: [
      { id: '1', displayName: 'Team Alpha', role: 'Lead PI (Core Leadership)' },
      { id: '1', displayName: 'Team Alpha', role: 'Project Manager' },
      { id: '2', displayName: 'Team Beta', role: 'Collaborating PI' },
      { id: '2', displayName: 'Team Beta', role: 'Co-PI (Core Leadership)' },
      { id: '2', displayName: 'Team Beta', role: 'ASAP Staff' },
      { id: '3', displayName: 'Team Gamma', role: 'Key Personnel' },
    ],
  };

  return <UserTeamsTabbedCard {...props} />;
};

export const MixedActiveInactive = () => {
  const props: ComponentProps<typeof UserTeamsTabbedCard> = {
    userAlumni: false,
    teams: [
      { id: '1', displayName: 'Team Alpha', role: 'Lead PI (Core Leadership)' },
      { id: '1', displayName: 'Team Alpha', role: 'Project Manager' },
      {
        id: '2',
        displayName: 'Team Beta',
        role: 'Collaborating PI',
        teamInactiveSince: '2024-06-01',
        inactiveSinceDate: '2024-06-01',
      },
      {
        id: '2',
        displayName: 'Team Beta',
        role: 'Co-PI (Core Leadership)',
        teamInactiveSince: '2024-06-01',
        inactiveSinceDate: '2024-03-01',
      },
      { id: '3', displayName: 'Team Gamma', role: 'Key Personnel' },
    ],
  };

  return <UserTeamsTabbedCard {...props} />;
};
