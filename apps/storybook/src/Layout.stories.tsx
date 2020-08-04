import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './padding';

export default {
  title: 'Organisms / Layout',
  component: Layout,
  decorators: [
    NoPaddingDecorator,
    (story: () => React.ReactNode) => (
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
    ),
  ],
};

export const Normal = () => <Layout>Content</Layout>;
export const Navigation = () => <Layout navigation>Content</Layout>;
