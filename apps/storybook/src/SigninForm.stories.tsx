import React from 'react';
import { text } from '@storybook/addon-knobs';

import { SigninForm } from '@asap-hub/react-components';

export default {
  title: 'Templates / Auth / Signin Form',
  component: SigninForm,
};

export const Normal = () => (
  <SigninForm
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    email="john.doe@example.com"
    password="_%6.o*fGR75)':7,"
  />
);

export const Signup = () => (
  <SigninForm
    signup
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    email="john.doe@example.com"
    password="_%6.o*fGR75)':7,"
  />
);
