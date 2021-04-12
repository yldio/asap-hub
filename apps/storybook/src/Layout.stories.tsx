import React, { useEffect, useContext, ComponentProps } from 'react';
import { Layout } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';
import { ToastContext } from '@asap-hub/react-context';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Organisms / Layout / Layout',
  component: Layout,
  decorators: [NoPaddingDecorator],
};

const props: Omit<ComponentProps<typeof Layout>, 'children'> = {
  userProfileHref: '/profile',
  teams: [
    { name: '1', href: '/team-1' },
    { name: '2', href: '/team-2' },
  ],
  aboutHref: '/about',
};

export const Normal = () => <Layout {...props}>Content</Layout>;

export const Toasts = () => {
  const numToasts = number('Number of toasts', 3, { min: 0 });
  const Toast: React.FC<Record<string, never>> = () => {
    const toast = useContext(ToastContext);
    useEffect(() => {
      Array.from({ length: numToasts }, (_, i) => `Toast ${i + 1}`).forEach(
        toast,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };

  return (
    <Layout {...props} key={numToasts}>
      <Toast />
      Content
    </Layout>
  );
};
