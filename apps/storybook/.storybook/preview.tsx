import { GlobalStyles, pixels } from '@asap-hub/react-components';
import { withKnobs } from '@storybook/addon-knobs';
import { Preview } from '@storybook/react-vite';

const preview = {
  decorators: [
    (Story) => (
      <>
        <GlobalStyles />
        <Story />
      </>
    ),
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: `${pixels.mobileScreen.width}px`,
            height: `${pixels.mobileScreen.height}px`,
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: `${pixels.tabletScreen.width}px`,
            height: `${pixels.tabletScreen.height}px`,
          },
        },
        smallDesktop: {
          name: 'Small Desktop',
          styles: {
            width: `${pixels.smallDesktopScreen.width}px`,
            height: `${pixels.smallDesktopScreen.height}px`,
          },
        },
        largeDesktop: {
          name: 'Large Desktop',
          styles: {
            width: `${pixels.largeDesktopScreen.width}px`,
            height: `${pixels.largeDesktopScreen.height}px`,
          },
        },
      },
    },
  },

  initialGlobals: {
    viewport: {
      value: 'smallDesktop',
      isRotated: false,
    },
  },
};

export default preview;
