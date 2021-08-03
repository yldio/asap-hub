import { ComponentProps } from 'react';
import { Layout, authTestUtils } from '@asap-hub/react-components';
import { boolean } from '@storybook/addon-knobs';

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

export const Onboardable = () => (
  <authTestUtils.Auth0Provider>
    <authTestUtils.LoggedIn
      user={{
        onboarded: false,
      }}
    >
      <Layout
        {...props}
        onboardModalHref="/wrong"
        onboardable={{ isOnboardable: boolean('isOnboardable', false) }}
      >
        Content
      </Layout>
    </authTestUtils.LoggedIn>
  </authTestUtils.Auth0Provider>
);
