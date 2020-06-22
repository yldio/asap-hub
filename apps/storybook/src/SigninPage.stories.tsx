import React from 'react';
import { text } from '@storybook/addon-knobs';

import { SigninPage } from '@asap-hub/react-components';
import { NoPaddingDecorator } from './padding';

export default {
  title: 'Pages / Auth / Sign in',
  component: SigninPage,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <SigninPage
    termsHref={text(
      'Terms Link',
      'https://foundation.wikimedia.org/wiki/Terms_of_Use/en',
    )}
    privacyPolicyHref={text(
      'Privacy Policy Link',
      'https://foundation.wikimedia.org/wiki/Privacy_policy',
    )}
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    email={text('Email', 'john.doe@example.com')}
    password={text('Password', "_%6.o*fGR75)':7,")}
  />
);
