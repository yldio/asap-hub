import React, { useContext, useEffect, useRef } from 'react';
import { WelcomePage } from '@asap-hub/react-components';
import { ToastContext, useAuth0 } from '@asap-hub/react-context';
import { useRouteParams, welcome } from '@asap-hub/routing';
import { API_BASE_URL } from '../config';

const Welcome: React.FC<Record<string, never>> = () => {
  const { code } = useRouteParams(welcome({}).invited);

  const { loginWithRedirect } = useAuth0();

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
    loginWithRedirect({
      prompt: 'login',
      screen_hint: 'signup',
      invitation_code: code,
    });
  };

  return (
    <WelcomePage
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
