import React from 'react';
import { text } from '@storybook/addon-knobs';

import { SigninPage } from '@asap-hub/react-components';
import { BasicLayoutDecorator } from './layout';

export default {
  title: 'Templates / Auth / Signin Page',
  component: SigninPage,
  decorators: [BasicLayoutDecorator],
};

export const Normal = () => (
  <SigninPage
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    appOrigin={window.location.origin}
    email={text('Email', 'john.doe@example.com')}
    password={text('Password', "_%6.o*fGR75)':7,")}
    customValidationMessage={text('Signin Error', '')}
  />
);

export const Signup = () => (
  <SigninPage
    signup
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    appOrigin={window.location.origin}
    email={text('Email', 'john.doe@example.com')}
    password={text('Password', "_%6.o*fGR75)':7,")}
    customValidationMessage={text('Signup Error', '')}
  />
);
