import { ComponentProps } from 'react';
import { Layout } from '@asap-hub/react-components';

import { NoPaddingDecorator } from './layout';
import { toastGenerator } from './toast';

export default {
  title: 'Organisms / Layout / Layout',
  component: Layout,
  decorators: [NoPaddingDecorator],
};

const props: Omit<ComponentProps<typeof Layout>, 'children'> = {
  userOnboarded: true,
  userProfileHref: '/profile',
  teams: [
    { name: '1', href: '/team-1' },
    { name: '2', href: '/team-2' },
  ],
  aboutHref: '/about',
};

export const Normal = () => <Layout {...props}>Content</Layout>;

export const Toasts = () => {
  const { numToasts, ToastGenerator } = toastGenerator();
  return (
    <Layout {...props} key={numToasts}>
      <ToastGenerator />
      Content
    </Layout>
  );
};
