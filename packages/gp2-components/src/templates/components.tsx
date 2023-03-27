import { pixels } from '@asap-hub/react-components';

const { rem } = pixels;

const components = {
  NavigationLink: {
    styles: {
      svg: {
        fill: 'currentColor',
      },
    },
  },
  Accordion: {
    containerStyles: {
      padding: 0,
    },
    itemStyles: {
      margin: 0,
    },
  },
  Pill: {
    styles: {
      margin: 0,
      fontSize: rem(14),
      padding: '4px 8px',
      lineHeight: rem(16),
      maxWidth: 'fit-content',
    },
  },
  TabLink: {
    styles: {
      paddingTop: 0,
    },
    layoutStyles: {
      margin: 0,
    },
  },
  ExternalLink: {
    styles: {
      margin: 0,
    },
  },
  EventPage: {
    containerStyles: {
      padding: 0,
    },
  },
  EditModal: {
    bodyStyles: {
      height: '100%',
      boxSizing: 'border-box',
      padding: 0,
    },
    styles: {
      display: 'unset',
    },
  },
};

export default components;
