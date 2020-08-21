import React from 'react';
import { Layout } from '@asap-hub/react-components';

import { NoPaddingDecorator } from './decorators';

export default {
  title: 'Organisms / Layout',
  component: Layout,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <Layout>Content</Layout>;
export const Navigation = () => <Layout navigation>Content</Layout>;
