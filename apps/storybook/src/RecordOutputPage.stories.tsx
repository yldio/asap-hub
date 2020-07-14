import React from 'react';

import { RecordOutputPage } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './padding';

export default {
  title: 'Pages / Record Output Page',
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <RecordOutputPage />;
