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
  pages: [],
  newsAndEvents: [
    {
      id: 'uuid-1',
      created: new Date(),
      type: 'News' as const,
      title: "Coordinating different approaches into Parkinson's",
      subtitle:
        'Point of view from ASAP scientific director, Randy Schekman, PhD and managing director, Ekemini A. U. Riley, PhD.',
    },
    {
      id: 'uuid-2',
      created: new Date(),
      type: 'Event' as const,
      title:
        'Welcome to the ASAP Collaborative Initiative: The Science & the scientists',
    },
  ],
  hrefProfile: text('Profile', '/network/users/1'),
  hrefTeamWorkspace: text('Team Workspace', ''),
});

export const Default = () => (
  <DashboardPage {...commonProps()}>
    <DashboardPageBody {...commonProps()} />
  </DashboardPage>
);
