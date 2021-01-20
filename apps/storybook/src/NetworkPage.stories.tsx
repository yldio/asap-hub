import React, { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import {
  NetworkPage,
  NetworkTeams,
  NetworkPeople,
} from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';
import { text, number } from '@storybook/addon-knobs';
import { TeamRole } from '@asap-hub/model';

import { LayoutDecorator } from './layout';
import { makeFlagDecorator } from './flags';

export default {
  title: 'Pages / Network',
  decorators: [LayoutDecorator, makeFlagDecorator('Groups Enabled', 'GROUPS')],
};

const member: Omit<
  ComponentProps<typeof NetworkTeams>['teams'][0]['members'][0],
  'id'
> = {
  firstName: 'Mason',
  lastName: 'Carpenter',
  email: 'mason@car.com',
  displayName: 'Birdie Romeo',
  role: 'Lead PI (Core Leadership)',
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
          role: 'Co-Investigator' as TeamRole,
          href: '#',
        },
      ],
      href: '#',
      role: 'Grantee' as const,
    })).slice(currentPageIndex * 10, currentPageIndex * 10 + 10),
    numberOfItems,
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
  };
};

export const TeamList = () => (
  <StaticRouter location="/teams">
    <NetworkPage
      page="teams"
      usersHref="/users"
      teamsHref="/teams"
      groupsHref="/groups"
      searchQuery={text('Search Query', '')}
      onChangeSearch={() => action('search change')}
    >
      <NetworkTeams {...teamProps()} />
    </NetworkPage>
  </StaticRouter>
);

export const PeopleList = () => (
  <StaticRouter location="/users">
    <NetworkPage
      page="users"
      usersHref="/users"
      teamsHref="/teams"
      groupsHref="/groups"
      searchQuery={text('Search Query', '')}
      onChangeSearch={() => action('search change')}
    >
      <NetworkPeople {...peopleProps()} />
    </NetworkPage>
  </StaticRouter>
);
