import React from 'react';
import { DashboardPage } from '@asap-hub/react-components';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Dashboard / Page',
  decorators: [LayoutDecorator],
};

export const Default = () => <DashboardPage>Page Content</DashboardPage>;
