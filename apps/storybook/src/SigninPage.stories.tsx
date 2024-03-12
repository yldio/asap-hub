import { SigninPage } from '@asap-hub/react-components';
import { BasicLayoutDecorator } from './layout';
import { text } from './knobs';

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
  />
);
