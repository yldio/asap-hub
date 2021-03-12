import React from 'react';
import { TeamsList } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';
import { createListTeamResponse } from '@asap-hub/fixtures';

export default {
  title: 'Molecules / Group Profile / Teams List',
  component: TeamsList,
};

export const Normal = () => (
  <TeamsList
    teams={createListTeamResponse(number('Number of Teams', 6)).items}
  />
);
