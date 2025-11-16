import React from 'react';
import {
  Link,
  Paragraph,
  UtilityBar,
  WelcomePage,
  mail,
} from '@asap-hub/react-components';
import { useAuth0GP2 } from '@asap-hub/react-context';
import { useHistory, useLocation } from 'react-router-dom';
import Frame from '../Frame';

const { INVITE_SUPPORT_EMAIL } = mail;

// common footer component for signup and welcome pages
const TermsFooter: React.FC<{ intro: string }> = ({ intro }) => (
  <Paragraph accent="lead">
    {intro} you are agreeing to our{' '}
    <Link href="/terms-and-conditions">Terms and Conditions</Link> and{' '}
    <Link href="/privacy-notice">Privacy Notice</Link>.
  </Paragraph>
);

// extracted here to avoid unnecessary/accidental re-rendering
export const values = {
  signup: {
    title: 'Join the GP2 Hub',
    content: 'Activate your account and start exploring the GP2 Network.',
    buttonText: 'Activate account',
    footer: () => <TermsFooter intro="By proceeding" />,
  },
  welcome: {
    title: 'Welcome to the GP2 Hub',
    content:
      'A private, invite-only network where the GP2 community collaborates.',
    buttonText: 'Sign in',
    footer: () => <TermsFooter intro="By signing in" />,
  },
} as const;

const Signin: React.FC<Record<string, never>> = () => {
  const { loginWithRedirect } = useAuth0GP2();

  const { pathname, search, hash } = useLocation();
  const searchParams = new URLSearchParams(search);
  const history = useHistory();

  const signin = () =>
    loginWithRedirect({
      prompt: 'login',
      appState: {
        targetUrl: pathname + search + hash,
      },
    });
  return (
    <Frame title="Sign in">
      <UtilityBar>
        <WelcomePage
          supportEmail={INVITE_SUPPORT_EMAIL}
          onClick={signin}
          authFailed={
            searchParams.has('state') && searchParams.has('error')
              ? 'invalid'
              : undefined
          }
          onCloseAuthFailedToast={() => {
            const newSearchParams = new URLSearchParams(
              history.location.search,
            );
            newSearchParams.delete('state');
            newSearchParams.delete('error');
            newSearchParams.delete('error_description');
            history.replace({ search: newSearchParams.toString() });
          }}
          values={values}
        />
      </UtilityBar>
    </Frame>
  );
};

export default Signin;
