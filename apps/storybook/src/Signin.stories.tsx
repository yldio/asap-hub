import React from 'react';
import { text } from '@storybook/addon-knobs';

import { Signin } from '@asap-hub/react-components';

export default {
  title: 'Templates / Auth / Sign in',
  component: Signin,
};

export const Normal = () => (
  <Signin
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    email={text('Email', 'john.doe@example.com')}
    password={text('Password', "_%6.o*fGR75)':7,")}
  />
);

export const Signup = () => (
  <Signin
    signup
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    email={text('Email', 'john.doe@example.com')}
    password={text('Password', "_%6.o*fGR75)':7,")}
  />
);
