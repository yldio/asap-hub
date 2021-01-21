import React from 'react';
import { GroupCard } from '@asap-hub/react-components';
import { text, array, number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Network / Group Card',
};

export const Normal = () => (
  <GroupCard
    href="#group"
    name={text('Name', 'My Group')}
    description={text('Description', 'Group Description')}
    tags={array('Tags', ['Tag 1', 'Tag 2'])}
    numberOfTeams={number('Number of Teams', 3)}
  />
);
