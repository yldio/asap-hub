import React from 'react';
import { Layout } from '@asap-hub/react-components';

import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Organisms / Layout',
  component: Layout,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <Layout
    networkHref="/network"
    libraryHref="/library"
    newsAndEventsHref="/news-and-events"
  >
    Content
  </Layout>
);
