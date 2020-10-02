import React from 'react';
import { NewsAndEventsPage } from '@asap-hub/react-components';

import { LayoutDecorator } from './decorators';

export default {
  title: 'Pages / News and Events List',
  decorators: [LayoutDecorator],
};

export const NewsAndEvents = () => (
  <NewsAndEventsPage>Content</NewsAndEventsPage>
);
