import React from 'react';
import { text } from '@storybook/addon-knobs';
import { ProfileBackground } from '@asap-hub/react-components';
import { TeamRole } from '@asap-hub/model';

export default {
  title: 'Organisms / Profile / Background',
};

export const Normal = () => (
  <ProfileBackground
    id="42"
    displayName={text('Display Name', 'John Doe')}
    firstName={text('First Name', 'John')}
    role={text('Role', 'Researcher') as TeamRole}
    approach={text('Approach', '')}
    responsibilities={text('Responsibilities', '')}
    href={text('Team', '/network/teams')}
    proposalHref={text('Proposal', '/shared-research/uuid')}
  />
);
