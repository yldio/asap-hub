import React from 'react';
import { NewsAndEventsPageHeader } from '@asap-hub/react-components';

import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Templates / News And Events / Header',
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <NewsAndEventsPageHeader />;
