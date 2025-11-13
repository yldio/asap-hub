import { Link, Paragraph, WelcomePage, mail } from '@asap-hub/react-components';
import { ToastContext, useAuth0GP2 } from '@asap-hub/react-context';
import { useRouteParams, welcome } from '@asap-hub/routing';
import { useContext, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';

const Welcome: React.FC<Record<string, never>> = () => {
  const { INVITE_SUPPORT_EMAIL } = mail;
  const { code } = useRouteParams(welcome({}).invited);

  const { loginWithRedirect } = useAuth0GP2();

  const toast = useContext(ToastContext);

  const invitationValidityCheck = useRef<Promise<boolean>>();
  useEffect(() => {
    const requestController = new AbortController();
    invitationValidityCheck.current = fetch(
      `${API_BASE_URL}/users/invites/${code}`,
      {
        headers: {
          accept: 'application/json',
        },
        signal: requestController.signal,
      },
    ).then(({ status }) => {
      if (status >= 200 && status < 300) {
        return true;
      }
      if (status === 404) {
        return false;
      }
      throw new Error(
        `Failed to fetch invitation. Expected status 2xx or 404. Received status ${status}.`,
      );
    });
    return () => requestController.abort();
  }, [code]);

  const createAccount = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loginWithRedirect({
      prompt: 'login',
      screen_hint: 'signup',
      invitation_code: code,
    });
  };

  const values = {
    signup: {
      title: 'Join the GP2 Hub',
      content: 'Activate your account and start exploring the GP2 Network.',
      buttonText: 'Activate account',
      footer: () => (
        <Paragraph accent="lead">
          By proceeding you are agreeing to our{' '}
          <Link href="/terms-and-conditions">Terms and Conditions</Link> and{' '}
          <Link href="/privacy-notice">Privacy Notice</Link>.
        </Paragraph>
      ),
    },
    welcome: {
      title: 'Welcome to the GP2 Hub',
      content:
        'A private, invite-only network where the GP2 community collaborates.',
      buttonText: 'Sign in',
      footer: () => (
        <Paragraph accent="lead">
          By signing in you are agreeing to our{' '}
          <Link href="/terms-and-conditions">Terms and Conditions</Link> and{' '}
          <Link href="/privacy-notice">Privacy Notice</Link>.
        </Paragraph>
      ),
    },
  };

  return (
    <WelcomePage
      allowSignup
      values={values}
      supportEmail={INVITE_SUPPORT_EMAIL}
      onClick={() =>
        // Effect should populate this ref before a click can occur
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        invitationValidityCheck
          .current!.then((isValid) =>
            isValid
              ? createAccount()
              : toast('Your invitation code is invalid.'),
          )
          .catch((err) => toast(String(err)))
      }
    />
  );
};

export default Welcome;
