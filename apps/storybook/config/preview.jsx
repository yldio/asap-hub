import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { addParameters, addDecorator } from '@storybook/react';

import { GlobalStyles } from '@asap-hub/react-components';

addDecorator((story) => (
  <>
    <GlobalStyles />
    {story()}
  </>
));

addDecorator(withKnobs);
addParameters({
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '667px',
        },
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '768px',
          height: `${(768 * 4) / 3}px`,
        },
      },
      smallDesktop: {
        name: 'Small Desktop',
        styles: {
          width: '1024px',
          height: `${(1024 * 9) / 16}px`,
        },
      },
      largeDesktop: {
        name: 'Large Desktop',
        styles: {
          width: '1440px',
          height: `${(1440 * 9) / 16}px`,
        },
      },
    },
    defaultViewport: 'mobile',
  },
});
