import React from 'react';
import { text } from '@storybook/addon-knobs';
import { messages } from '@asap-hub/react-components';

export default { title: 'Pages / Emails' };

export const Welcome = () => (
  <messages.Welcome
    firstName={text('First Name', '{{ firstName }}')}
    lastName={text('First Name', '{{ lastName }}')}
    link={text('First Name', '{{ link }}')}
    privacyPolicyHref={text(
      'Privacy Policy',
      'https://hub.asap.science/privacy-policy',
    )}
    termsHref={text(
      'Terms and Conditions',
      'https://hub.asap.science/terms-and-conditions',
    )}
  />
);
