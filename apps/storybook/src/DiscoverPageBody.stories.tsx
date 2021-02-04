import React, { ComponentProps } from 'react';
import { DiscoverPageBody } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Discover / Page Body',
};

const props = (): ComponentProps<typeof DiscoverPageBody> => ({
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
  training: [
    {
      id: 'uuid-1',
      created: new Date().toISOString(),
      type: 'Training' as const,
      title: "Coordinating different approaches into Parkinson's",
      shortText:
        'Point of view from ASAP scientific director, Randy Schekman, PhD and managing director, Ekemini A. U. Riley, PhD.',
      thumbnail: 'https://picsum.photos/200',
      href: '#',
    },
  ],
  members: [
    {
      id: '1',
      href: '#',
      displayName: 'Daniel Ramirez',
      firstName: 'Daniel',
      lastName: 'Ramirez',
      role: 'Staff',
    },
    {
      id: '2',
      href: '#',
      displayName: 'Peter Venkman',
      firstName: 'Peter',
      lastName: 'Venkman',
      role: 'Staff',
    },
    {
      id: '3',
      href: '#',
      displayName: 'Tess W. B. Goetz',
      firstName: 'Tess',
      lastName: 'Goetz',
      role: 'Staff',
    },
    {
      id: '4',
      href: '#',
      displayName: 'Robin Peploe',
      firstName: 'Robin',
      lastName: 'Peploe',
      role: 'Staff',
    },
    {
      id: '5',
      href: '#',
      displayName: 'Alice Lane',
      firstName: 'Alice',
      lastName: 'Lane',
      role: 'Staff',
    },
    {
      id: '6',
      href: '#',
      displayName: 'Philip Mars',
      firstName: 'Philip',
      lastName: 'Mars',
      role: 'Staff',
    },
    {
      id: '7',
      href: '#',
      displayName: 'Emmanuel Depay',
      firstName: 'Emanuel',
      lastName: 'Depay',
      role: 'Staff',
    },
  ],
  aboutUs: text('About Us', ''),
});

export const Normal = () => <DiscoverPageBody {...props()} />;
