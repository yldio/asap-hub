import React from 'react';
import { TeamsList } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Group Profile / Teams List',
  component: TeamsList,
};

export const Normal = () => (
  <TeamsList
    teams={Array.from({ length: number('Number of Teams', 6) }, (_, i) => ({
      displayName: `${i + 1}`,
      href: `#${i}`,
    }))}
  />
);
