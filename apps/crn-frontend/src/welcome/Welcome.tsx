import { useCookieConsent } from '@asap-hub/frontend-utils';
import { WelcomePage } from '@asap-hub/react-components';
import { ToastContext, useAuth0CRN } from '@asap-hub/react-context';
import { useRouteParams, welcome } from '@asap-hub/routing';
import { useContext, useEffect, useRef } from 'react';
import { API_BASE_URL, COOKIE_CONSENT_NAME } from '../config';

const Welcome: React.FC<Record<string, never>> = () => {
  const { code } = useRouteParams(welcome({}).invited);

  const { loginWithRedirect } = useAuth0CRN();

  const toast = useContext(ToastContext);

  const { showCookieModal, onSaveCookiePreferences } = useCookieConsent(
    COOKIE_CONSENT_NAME,
    `${API_BASE_URL}/cookie-preferences/save`,
  );

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

  return (
    <WelcomePage
      showCookieModal={showCookieModal}
      onSaveCookiePreferences={onSaveCookiePreferences}
      allowSignup
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
