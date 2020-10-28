import React from 'react';
import { text } from '@storybook/addon-knobs';
import { ProfileBackground } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Profile / Background',
};

export const Normal = () => (
  <ProfileBackground
    id="42"
    displayName={text('Display Name', 'John Doe')}
    firstName={text('First Name', 'John')}
    role={text('Role', 'Researcher')}
    approach={text('Approach', '')}
    responsibilities={text('Responsibilities', '')}
    href={text('Team', '/network/teams')}
    proposalHref={text('Proposal', '/shared-research/uuid')}
  />
);
