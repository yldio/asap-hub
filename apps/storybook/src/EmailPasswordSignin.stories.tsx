import React from 'react';
import { text } from '@storybook/addon-knobs';

import { EmailPasswordSignin } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Auth / Email-Password signin',
  component: EmailPasswordSignin,
};

export const Normal = () => (
  <EmailPasswordSignin
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    email={text('Email', 'john.doe@example.com')}
    password={text('Password', "_%6.o*fGR75)':7,")}
  />
);
