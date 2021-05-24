import { TeamsList } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';
import { createListTeamResponse } from '@asap-hub/fixtures';

export default {
  title: 'Molecules / Teams / List',
  component: TeamsList,
};

export const Normal = () => (
  <TeamsList
    teams={createListTeamResponse(number('Number of Teams', 6)).items}
    max={number('Maximum', 10)}
  />
);

export const Inline = () => (
  <TeamsList
    inline
    teams={createListTeamResponse(number('Number of Teams', 6)).items}
    max={number('Maximum', 10)}
  />
);
