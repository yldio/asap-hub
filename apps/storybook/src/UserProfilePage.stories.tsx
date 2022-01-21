import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import { text, select, boolean } from '@storybook/addon-knobs';
import { UserProfilePage } from '@asap-hub/react-components';
import { TeamRole } from '@asap-hub/model';
import { network } from '@asap-hub/routing';

import { LayoutDecorator } from './layout';
import { UserProfileDecorator } from './user-profile';

export default {
  title: 'Templates / User Profile / Page',
  decorators: [LayoutDecorator, UserProfileDecorator],
};

const propsViewOnly = (): Omit<
  ComponentProps<typeof UserProfilePage>,
  'children'
> => {
  const degree = select(
    'Degree',
    ['Empty', 'BA', 'BSc', 'MSc', 'PhD', 'MD', 'MD, PhD', 'MPH', 'MA', 'MBA'],
    'PhD',
  );
  return {
    id: 'u42',
    displayName: text('Display Name', 'Phillip Mars'),
    institution: text('Institution', 'Yale University'),
    firstName: text('First Name', 'Phillip'),
    lastName: text('Last Name', 'Mars'),
    email: text('Email', 'me@example.com'),
    degree: degree === 'Empty' ? undefined : degree,
    contactEmail: text('Contact email', 'contact@example.com'),
    country: text('Country', 'New Haven'),
    city: text('City', 'Connecticut'),
    teams: [
      {
        id: 't42',
        role: text('Role', 'Researcher') as TeamRole,
        displayName: text('Team Name', 'Ferguson, M'),
      },
    ],
    jobTitle: text('Job Title', 'Assistant Professor'),
    avatarUrl: text(
      'Avatar URL',
      'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
    ),
    role: select('Role', ['Grantee', 'Guest', 'Staff'], 'Grantee'),
    social: {
      twitter: text('Twitter Handle', '123'),
      github: text('Github Handle', '123'),
      googleScholar: text('Google Scholar', '123'),
      linkedIn: text('Linkedin', '123'),
      orcid: text('Orcid Id', '123'),
      researchGate: text('Research Gate', '123'),
      researcherId: text('Researcher Id', '123'),
      website1: text('Website 1', 'http://example.com/website1'),
      website2: text('Website 2', 'http://example.com/website2'),
    },
    labs: [
      { id: 'cd7be4904', name: 'Manchester' },
      { id: 'cd7be4905', name: 'Glasgow' },
    ],
  };
};
const propsEditable = (): ReturnType<typeof propsViewOnly> => ({
  ...propsViewOnly(),
  editPersonalInfoHref: '/wrong',
  editContactInfoHref: '/wrong',
  onImageSelect: () => {},
});

export const Normal = () => {
  const props = boolean('Editable', false) ? propsEditable() : propsViewOnly();

  const tabRoutes = network({}).users({}).user({ userId: props.id });
  const tab = select(
    'Active Tab',
    {
      About: tabRoutes.about({}).$,
      Research: tabRoutes.research({}).$,
      Outputs: tabRoutes.outputs({}).$,
    },
    'About',
  );

  return (
    <StaticRouter key={tab} location={tab}>
      <UserProfilePage {...props}>Page Content</UserProfilePage>
    </StaticRouter>
  );
};
