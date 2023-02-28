import { ComponentProps } from 'react';
import { teamRole } from '@asap-hub/model';
import { UserTeamsTabbedCard } from '@asap-hub/react-components';
import { boolean, number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / User Teams Tabbed Card',
};

export const Normal = () => {
  const props: ComponentProps<typeof UserTeamsTabbedCard> = {
    userName: 'Phillip Mars',
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
