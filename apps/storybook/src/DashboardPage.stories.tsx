import React from 'react';
import { text } from '@storybook/addon-knobs';
import { DashboardPage, DashboardPageBody } from '@asap-hub/react-components';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Dashboard',
  decorators: [LayoutDecorator],
};

const commonProps = () => ({
  firstName: text('First Name', 'Phillip'),
  pages: [
    {
      path: '/',
      title: 'Welcome Package',
      text: [
        "Find your way around the grant, ASAP's ways of working, the deadlines and what is expected of grantees.",
        'Open to read the Welcome Package',
      ].join(''),
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
  hrefLibrary: '/library',
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
