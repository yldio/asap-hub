import {
  Accordion,
  libraryIcon,
  giftIcon,
  confidentialIcon,
} from '@asap-hub/react-components';

export default {
  title: 'Molecules / Accordion',
};

export const Normal = () => (
  <Accordion
    items={[
      {
        icon: libraryIcon,
        title: 'How to use the Hub?',
        description:
          'Explore a series of short videos that highlight the many different aspects of the Hub.',
        hrefText: 'Explore videos',
        href: '#Wrong',
      },
      {
        icon: giftIcon,
        title: 'Grant Welcome Packet',
        description:
          'All you need to know about the Network, the Hub, sharing, meetings, communications, publishing and more.',
        hrefText: 'Open the packet',
        href: 'http://google.com',
      },
      {
        icon: confidentialIcon,
        title: 'Confidentiality Rules',
        description: 'View all confidentiality rules related to the Hub.',
        hrefText: 'Read more',
        href: 'http://google.com',
      },
    ]}
  />
);
