import React from 'react';
import { DiscoverPage } from '@asap-hub/react-components';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Discover / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => <DiscoverPage>Page Content</DiscoverPage>;
