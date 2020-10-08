import React, { ComponentProps } from 'react';
import {
  NetworkPage,
  NetworkTeams,
  NetworkPeople,
} from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text, number } from '@storybook/addon-knobs';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Network',
  decorators: [LayoutDecorator],
};

const member: Omit<
  ComponentProps<typeof NetworkTeams>['teams'][0]['members'][0],
  'id'
> = {
  firstName: 'Mason',
  lastName: 'Carpenter',
  email: 'mason@car.com',
  displayName: 'Birdie Romeo',
  role: 'Lead PI',
};

const teamProps = (): ComponentProps<typeof NetworkTeams> => {
  const numberOfItems = number('Number of Teams', 2, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return {
    teams: Array.from({ length: numberOfItems }, (_, i) => ({
      id: `t${i}`,
      displayName: `Team Barnes, A. ${i + 1}`,
      projectTitle:
        'Caczis lu ugez fotsilaz ijmomi uliruti lerohe ji godmiw suuzu imatorok vuk nubozo eveoluf hec sacme sevce wizlec.',
      skills: ['Neurological Diseases'],
      members: [
        { ...member, id: 'm0' },
        { ...member, id: 'm1' },
      ],
      href: '#',
    })).slice(currentPageIndex * 10, currentPageIndex * 10 + 10),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
  };
};
const peopleProps = (): ComponentProps<typeof NetworkPeople> => {
  const numberOfItems = number('Number of Teams', 2, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;
  return {
    people: Array.from({ length: numberOfItems }, (_, i) => ({
      id: `p${i}`,
      createdDate: '2020-09-07T17:36:54Z',
      displayName: `Agnete Kirkeby ${i + 1}`,
      firstName: 'Agnete',
      lastName: 'Kirkeby',
      jobTitle: 'Assistant Professor',
      institution: 'University of Copenhagen',
      teams: [
        {
          id: 't1',
          displayName: 'Jakobsson, J',
          role: 'Co-Investigator',
          href: '#',
        },
      ],
      href: '#',
    })).slice(currentPageIndex * 10, currentPageIndex * 10 + 10),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
  };
};

export const TeamList = () => (
  <NetworkPage
    page="teams"
    searchQuery={text('Search Query', '')}
    onChangeSearch={() => action('search change')}
    onChangeToggle={() => action('toggle')}
  >
    <NetworkTeams {...teamProps()} />
  </NetworkPage>
);

export const PeopleList = () => (
  <NetworkPage
    page="users"
    searchQuery={text('Search Query', '')}
    onChangeSearch={() => action('search change')}
    onChangeToggle={() => action('toggle')}
  >
    <NetworkPeople {...peopleProps()} />
  </NetworkPage>
);
