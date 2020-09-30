import React from 'react';
import { text } from '@storybook/addon-knobs';

import { SigninForm } from '@asap-hub/react-components';

export default {
  title: 'Templates / Auth / Sign in',
  component: SigninForm,
};

export const Normal = () => (
  <SigninForm
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    email={text('Email', 'john.doe@example.com')}
    password={text('Password', "_%6.o*fGR75)':7,")}
    customValidationMessage={text('Signin Error', '')}
  />
);

export const Signup = () => (
  <SigninForm
    signup
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    email={text('Email', 'john.doe@example.com')}
    password={text('Password', "_%6.o*fGR75)':7,")}
    customValidationMessage={text('Signup Error', '')}
  />
);
