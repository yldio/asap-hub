import React, { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import { date, text, select, boolean } from '@storybook/addon-knobs';
import { UserProfilePage } from '@asap-hub/react-components';
import { TeamRole } from '@asap-hub/model';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / User Profile / Page',
  decorators: [LayoutDecorator],
};

const propsViewOnly = (): Omit<
  ComponentProps<typeof UserProfilePage>,
  'children'
> => ({
  displayName: text('Display Name', 'Phillip Mars, PhD'),
  institution: text('Institution', 'Yale University'),
  lastModifiedDate: new Date(
    date('Last modified', new Date(2020, 6, 12, 14, 32)),
  ).toISOString(),
  firstName: text('First Name', 'Phillip'),
  lastName: text('Last Name', 'Mars'),
  email: text('Email', 'me@example.com'),
  contactEmail: text('Contact email', 'contact@example.com'),
  location: text('Location', 'New Haven, Connecticut'),
  teams: [
    {
      id: '42',
      href: '#42',
      role: text('Role', 'Researcher') as TeamRole,
      displayName: text('Team Name', 'Ferguson, M'),
      approach: text(
        'Approach',
        'As an expert in MRI scans, Tess will leverage past experience to lead the team to define the next big thing in MRI scans and keep the budget on track. We will first quantify the motor function of A53T human α-synuclein Tg mice and age-matched non-transgenic littermates using a modified open field test. To evaluate whether changes of dynein were related to α-synuclein aggregation, double immunostaining for α-synuclein and dynein will be performed. Finally, an analysis of the correlation between motor behaviors and the protein level of dynein in the striatum will be conducted.',
      ),
      responsibilities: text(
        'Responsibilities',
        "Phillip's team wants to understand how A53T-alpha-synuclein affects synapse structure/ function and identify possible correlation between its neurotoxicity and specific neuronal subtypes.",
      ),
    },
  ],
  jobTitle: text('Job Title', 'Assistant Professor'),
  avatarUrl: text(
    'Avatar URL',
    'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
  ),
  role: select('Role', ['Grantee', 'Guest'], 'Grantee'),
  social: {
    twitter: text('Twitter Handle', '123'),
    github: text('Github Handle', '123'),
    googleScholar: text('Google Scholar', '123'),
    linkedIn: text('Linkedin', '123'),
    orcid: text('Orcid Id', '123'),
    researchGate: text('Research Gate', '123'),
    researcherId: text('Researcher Id', '123'),
  },
  aboutHref: '/wrong',
  researchHref: '/wrong',
  outputsHref: '/wrong',
  discoverHref: '/discover',
});
const propsEditable = (): ReturnType<typeof propsViewOnly> => ({
  ...propsViewOnly(),
  editPersonalInfoHref: '/wrong',
  editContactInfoHref: '/wrong',
  onImageSelect: () => {},
});

export const Normal = () => {
  const props = boolean('Editable', false) ? propsEditable() : propsViewOnly();
  const tab = select('Active Tab', ['About', 'Research', 'Outputs'], 'About');
  return (
    <StaticRouter key={tab} location={`/${tab}`}>
      <UserProfilePage
        {...props}
        aboutHref="/About"
        researchHref="/Research"
        outputsHref="/Outputs"
      >
        Page Content
      </UserProfilePage>
    </StaticRouter>
  );
};

export const Staff = () => (
  <UserProfilePage {...propsViewOnly()} role="Staff">
    Page Content
  </UserProfilePage>
);
