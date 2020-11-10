import React from 'react';
import { BasicLayout } from '@asap-hub/react-components';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / Basic Layout',
  component: BasicLayout,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <BasicLayout>Content</BasicLayout>;
