import React from 'react';
import { SharedResearchPage } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Shared Research / Page',
  decorators: [LayoutDecorator],
};

export const SharedResearchList = () => (
  <SharedResearchPage
    searchQuery={text('Search Query', '')}
    filters={new Set()}
  >
    Page Content
  </SharedResearchPage>
);
