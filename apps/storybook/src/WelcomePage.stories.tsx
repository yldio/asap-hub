import { WelcomePage } from '@asap-hub/react-components';
import { action } from '@storybook/addon-actions';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Templates / Auth / Welcome Page',
  component: WelcomePage,
  decorators: [NoPaddingDecorator],
};

const onSaveCookiePreferences = () => {};

export const Normal = () => (
  <WelcomePage
    onClick={action('sign-in-click')}
    onSaveCookiePreferences={onSaveCookiePreferences}
  />
);
export const AllowSignup = () => (
  <WelcomePage
    allowSignup
    onClick={action('create-account-click')}
    onSaveCookiePreferences={onSaveCookiePreferences}
  />
);
export const AuthError = () => (
  <WelcomePage
    onClick={action('sign-in-click')}
    authFailed={'invalid'}
    onCloseAuthFailedToast={action('close-auth-failed-toast-click')}
    onSaveCookiePreferences={onSaveCookiePreferences}
  />
);
