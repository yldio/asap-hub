import React from 'react';
import { text } from '@storybook/addon-knobs';
import { DashboardPage, DashboardPageBody } from '@asap-hub/react-components';

import { LayoutDecorator } from './layout';

export default {
  title: 'Pages / Dashboard',
  decorators: [LayoutDecorator],
};

const commonProps = () => ({
  firstName: text('First Name', 'Phillip'),
  pages: [
    {
      id: 'uuid-1',
      path: '/',
      title: 'Welcome Package',
      shortText: [
        "Find your way around the grant, ASAP's ways of working, the deadlines and what is expected of grantees.",
        'Open to read the Welcome Package',
      ].join(''),
      text: '',
    },
  ],
  newsAndEvents: [
    {
      id: 'uuid-1',
      created: new Date().toISOString(),
      type: 'News' as const,
      title: "Coordinating different approaches into Parkinson's",
      subtitle:
        'Point of view from ASAP scientific director, Randy Schekman, PhD and managing director, Ekemini A. U. Riley, PhD.',
    },
    {
      id: 'uuid-2',
      created: new Date().toISOString(),
      type: 'Event' as const,
      title:
        'Welcome to the ASAP Collaborative Initiative: The Science & the scientists',
    },
  ],
  hrefDiscoverAsap: '/dicover',
  hrefSharedResearch: '/shared-research',
  hrefNewsAndEvents: '/news-and-events',
  hrefProfile: text('Profile', '/network/users/1'),
  hrefTeamsNetwork: '/network/teams',
  hrefTeamWorkspace: text('Team Workspace', ''),
  hrefUsersNetwork: '/network/users',
});

export const Default = () => (
  <DashboardPage {...commonProps()}>
    <DashboardPageBody {...commonProps()} />
  </DashboardPage>
);
