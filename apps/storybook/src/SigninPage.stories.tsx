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
    email="john.doe@example.com"
    password="_%6.o*fGR75)':7,"
    appName={text('App Name', 'ASAP Hub')}
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
    email="john.doe@example.com"
    password="_%6.o*fGR75)':7,"
    appName="App Name"
  />
);
