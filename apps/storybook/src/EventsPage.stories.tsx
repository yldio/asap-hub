import React from 'react';
import { EventsPage } from '@asap-hub/react-components';

import { LayoutDecorator } from './layout';

export default {
  title: 'Templates / Events / Page',
  decorators: [LayoutDecorator],
};

export const Normal = () => <EventsPage>Page Content</EventsPage>;
