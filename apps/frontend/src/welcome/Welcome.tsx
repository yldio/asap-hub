import React from 'react';
import { WelcomePage } from '@asap-hub/react-components';
import { useAuth0 } from '@asap-hub/react-context';
import { useRouteParams, welcome } from '@asap-hub/routing';

const Welcome: React.FC<Record<string, never>> = () => {
  const { code } = useRouteParams(welcome({}).invited);

  const { loginWithRedirect } = useAuth0();

  // Check for an invalid code - fire and forget and don't delay rendering since
  // this is not security-critical, it's just nicer to fail now instead of after registration.
  // useEffect(() => {
  //   const requestController = new AbortController();
  //   fetch(`${API_BASE_URL}/users/invites/${code}`, {
  //     headers: {
  //       accept: 'application/json',
  //     },
  //     signal: requestController.signal,
  //   })
  //     .then(({ status }) => {
  //       if (status >= 400 && status < 500) {
  //         history.replace('/');
  //       }
  //     })
  //     .catch();
  //
  //   return () => requestController.abort();
  // }, [history, code]);

  const createAccount = () => {
    loginWithRedirect({
      prompt: 'login',
      screen_hint: 'signup',
      invitation_code: code,
    });
  };

  return <WelcomePage allowSignup onClick={createAccount} />;
};

export default Welcome;
