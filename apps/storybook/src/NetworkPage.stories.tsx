import React from 'react';
import {
  NetworkPage,
  NetworkTeam,
  NetworkPeople,
} from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Network',
  decorators: [LayoutDecorator],
};

const member = {
  id: 'ff0e04ac-4769-44ed-8d3b-245c1bfe17b3',
  firstName: 'Mason',
  lastName: 'Carpenter',
  displayName: 'Birdie Romeo',
  role: 'VrrPdl',
};

const teamProps = {
  teams: [
    {
      id: 'ee98d044-79a7-4028-915d-7f88793e3190',
      displayName: 'Team Barnes, A.',
      applicationNumber: 'P9gr6',
      projectTitle:
        'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',
      projectSummary:
        'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain organoids',
      skills: [
        'Neurological Diseases',
        'Neurological Diseases',
        'Neurological Diseases',
        'Neurological Diseases',
        'Neurological Diseases',
        'Neurological Diseases',
      ],
      members: [member, member],
      lastModifiedDate: '2020-09-03T10:59:26Z',
      href: '#',
    },
    {
      id: 'ee98d044-79a7-4028-915d-7f88793e3191',
      displayName: 'Team Barnes, B.',
      applicationNumber: 'P9gr6',
      projectTitle:
        'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',
      projectSummary:
        'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain organoids',
      skills: ['Neurological Diseases'],
      members: [member],
      lastModifiedDate: '2020-09-03T10:59:26Z',
      href: '#',
    },
  ],
};
const peopleProps = {
  people: [
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb6',
      createdDate: '2020-09-07T17:36:54Z',
      lastModifiedDate: '2020-09-07T17:36:54Z',
      displayName: 'Agnete Kirkeby',
      email: 'agnete.kirkeby@sund.ku.dk',
      firstName: 'Agnete',
      middleName: '',
      lastName: 'Kirkeby',
      jobTitle: 'Assistant Professor',
      institution: 'University of Copenhagen',
      teams: [
        {
          id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
          displayName: 'Jakobsson, J',
          role: 'Core Leadership - Co-Investigator',
          href: '#',
        },
      ],
      orcid: '0000-0001-8203-6901',
      orcidWorks: [],
      skills: [],
      href: '#',
    },
    {
      id: '55724942-3408-4ad6-9a73-14b92226ffb7',
      createdDate: '2020-09-07T17:36:54Z',
      lastModifiedDate: '2020-09-07T17:36:54Z',
      displayName: 'Agnete Kirkeby',
      email: 'agnete.kirkeby@sund.ku.dk',
      firstName: 'Agnete',
      middleName: '',
      lastName: 'Kirkeby',
      jobTitle: 'Assistant Professor',
      institution: 'University of Copenhagen',
      teams: [
        {
          id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
          displayName: 'Jakobsson, J',
          role: 'Core Leadership - Co-Investigator',
          href: '#',
        },
      ],
      orcid: '0000-0001-8203-6901',
      orcidWorks: [],
      skills: [],
      href: '#',
    },
  ],
};

export const TeamList = () => (
  <NetworkPage
    page="teams"
    query={text('Query', '')}
    searchOnChange={() => action('search change')}
    toggleOnChange={() => action('toggle')}
  >
    <NetworkTeam {...teamProps} />
  </NetworkPage>
);

export const PeopleList = () => (
  <NetworkPage
    page="users"
    query={text('Query', '')}
    searchOnChange={() => action('search change')}
    toggleOnChange={() => action('toggle')}
  >
    <NetworkPeople {...peopleProps} />
  </NetworkPage>
);
