import React from 'react';
import { DiscoverPage, DiscoverPageBody } from '@asap-hub/react-components';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Discover',
  decorators: [LayoutDecorator],
};

const commonProps = () => ({
  pages: [
    {
      id: 'uuid-1',
      path: '/',
      title: 'Welcome Package',
      text: '',
      shortText: [
        "Find your way around the grant, ASAP's ways of working, the deadlines and what is expected of grantees.",
        'Open to read the Welcome Package',
      ].join(''),
    },
    {
      id: 'uuid-2',
      path: '/',
      title: "ASAP's Commitment to Open Science",
      text: '',
      shortText: [
        'When in doubt, check our Frequently Asked Questions about how, when and what to share according to our policy.',
      ].join(''),
    },
  ],
  members: [
    {
      id: '1',
      displayName: 'Daniel Ramirez',
      firstName: 'Daniel',
      lastName: 'Ramirez',
      email: 'd@niel.com',
      role: 'Staff',
    },
    {
      id: '2',
      displayName: 'Peter Venkman',
      firstName: 'Peter',
      lastName: 'Venkman',
      email: 'peter@venk.com',
      role: 'Staff',
    },
    {
      id: '3',
      displayName: 'Tess W. B. Goetz',
      firstName: 'Tess',
      lastName: 'Goetz',
      email: 'tess@go.com',
      role: 'Staff',
    },
    {
      id: '4',
      displayName: 'Robin Peploe',
      firstName: 'Robin',
      lastName: 'Peploe',
      email: 'robin@pep.com',
      role: 'Staff',
    },
    {
      id: '5',
      displayName: 'Alice Lane',
      firstName: 'Alice',
      lastName: 'Lane',
      email: 'alice@lane.com',
      role: 'Staff',
    },
    {
      id: '6',
      displayName: 'Philip Mars',
      firstName: 'Philip',
      lastName: 'Mars',
      email: 'philip@mars.com',
      role: 'Staff',
    },
    {
      id: '7',
      displayName: 'Emmanuel Depay',
      firstName: 'Emanuel',
      lastName: 'Depay',
      email: 'em@nuel.com',
      role: 'Staff',
    },
  ],
  aboutUs: ``,
});

export const Default = () => (
  <DiscoverPage {...commonProps()}>
    <DiscoverPageBody {...commonProps()} />
  </DiscoverPage>
);
