import React from 'react';
import { date, text, number } from '@storybook/addon-knobs';
import { ProfileHeader } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Templates / Profile / Header',
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <ProfileHeader
    department={text('Department', 'Biology Department')}
    displayName={text('Display Name', 'Phillip Mars, PhD')}
    lastModifiedDate={new Date(
      date('Last modified', new Date(2020, 6, 12, 14, 32)),
    ).toISOString()}
    institution={text('Institution', 'Yale University')}
    firstName={text('First Name', 'Phillip')}
    lastName={text('Last Name', 'Mars')}
    location={text('Location', 'New Haven, Connecticut')}
    teams={Array(number('Number of Teams', 1)).fill({
      id: '42',
      href: '#42',
      role: text('Role', 'Researcher'),
      displayName: text('Team Name', 'Team A'),
    })}
    jobTitle={text('Job Title', 'Assistant Professor')}
    avatarURL={text(
      'Avatar URL',
      'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
    )}
    email="test@test.com"
    aboutHref="/other"
    researchHref="/other"
    outputsHref="/other"
  />
);
