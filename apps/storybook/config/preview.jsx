import { GlobalStyles, pixels } from '@asap-hub/react-components';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator, addParameters } from '@storybook/react';


addDecorator((story) => (
  <>
    <GlobalStyles />
    {story()}
  </>
));

addDecorator(withKnobs({ escapeHTML: false }));
addParameters({
  viewport: {
    viewports: {
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
    defaultViewport: 'mobile',
  },
});
