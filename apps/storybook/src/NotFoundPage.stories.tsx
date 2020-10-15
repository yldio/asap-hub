import React from 'react';
import { NotFoundPage } from '@asap-hub/react-components';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / Not Found',
  decorators: [LayoutDecorator],
};

export const Normal = () => <NotFoundPage />;
