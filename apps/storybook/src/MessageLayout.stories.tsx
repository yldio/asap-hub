import React from 'react';
import { MessageLayout } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Messages / Layout',
  component: MessageLayout,
};

export const Normal = () => (
  <MessageLayout
    termsHref={text('Terms link', 'https://example.com/terms')}
    privacyPolicyHref={text(
      'Privacy Policy link',
      'https://example.com/privacy',
    )}
  >
    Content
  </MessageLayout>
);
