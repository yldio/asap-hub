import React, { ComponentProps } from 'react';
import { date, text, number, select } from '@storybook/addon-knobs';
import { UserProfileHeader } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './layout';

export default {
  title: 'Templates / User Profile / Header',
  decorators: [NoPaddingDecorator],
};

const commonProps = (): ComponentProps<typeof UserProfileHeader> => ({
  department: text('Department', 'Biology Department'),
  displayName: text('Display Name', 'Phillip Mars, PhD'),
  lastModifiedDate: new Date(
    date('Last modified', new Date(2020, 6, 12, 14, 32)),
  ).toISOString(),
  institution: text('Institution', 'Yale University'),
  firstName: text('First Name', 'Phillip'),
  lastName: text('Last Name', 'Mars'),
  location: text('Location', 'New Haven, Connecticut'),
  teams: Array(number('Number of Teams', 1)).fill({
    id: '42',
    href: '#42',
    role: text('Role', 'Researcher'),
    displayName: text('Team Name', 'Team A'),
  }),
  jobTitle: text('Job Title', 'Assistant Professor'),
  avatarUrl: text(
    'Avatar URL',
    'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
  ),
  email: 'test@test.com',
  aboutHref: '/other',
  researchHref: '/other',
  outputsHref: '/other',
  discoverHref: '/discover',
  role: select('Role', ['Staff', 'Grantee', 'Guest'], 'Staff'),
  contactEmail: 'test@example.com',
  social: {
    twitter: text('Twitter Handle', '123'),
    github: text('Github Handle', '123'),
    googleScholar: text('Google Scholar', '123'),
    linkedIn: text('Linkedin', '123'),
    orcid: text('Orcid Id', '123'),
    researchGate: text('Research Gate', '123'),
    researcherId: text('Researcher Id', '123'),
  },
});

export const ViewOnly = () => <UserProfileHeader {...commonProps()} />;

export const Editable = () => (
  <UserProfileHeader
    {...commonProps()}
    editPersonalInfoHref="/other"
    editContactInfoHref="/other"
  />
);
