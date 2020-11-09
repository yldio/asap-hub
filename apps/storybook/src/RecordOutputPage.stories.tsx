import React from 'react';

import { RecordOutputPage } from '@asap-hub/react-components';
import { LayoutDecorator } from './layout';

export default {
  title: 'Pages / Record Output Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => <RecordOutputPage />;
