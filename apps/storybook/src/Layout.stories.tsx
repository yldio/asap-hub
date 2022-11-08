import { ComponentProps } from 'react';
import { Layout, authTestUtils } from '@asap-hub/react-components';
import { number, optionsKnob } from '@storybook/addon-knobs';

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

export const Onboardable = () => {
  const steps = optionsKnob(
    'Incomplete Steps',
    {
      Details: 'Details',
      Biography: 'Biography',
      Questions: 'Questions',
      Expertise: 'Expertise',
      Role: 'Role',
    },
    [],
    { display: 'inline-check' },
  ) as unknown as string[]; // The typings for this are wrong. We should upgrade.

  return (
    <authTestUtils.Auth0ProviderCRN>
      <authTestUtils.LoggedInCRN
        user={{
          onboarded: false,
        }}
      >
        <Layout
          {...props}
          onboardModalHref="/wrong"
          onboardable={{
            incompleteSteps: steps.map((step) => ({
              label: step,
              modalHref: '/wrong',
            })),
            isOnboardable: !steps.length,
            totalSteps: number('Total Steps', 5),
          }}
        >
          Content
        </Layout>
      </authTestUtils.LoggedInCRN>
    </authTestUtils.Auth0ProviderCRN>
  );
};
