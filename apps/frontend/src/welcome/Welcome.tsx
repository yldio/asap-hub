import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { WelcomePage } from '@asap-hub/react-components';
import { useAuth0 } from '@asap-hub/react-context';

import { API_BASE_URL } from '../config';

const Welcome: React.FC<{}> = () => {
  const history = useHistory();
  const { code } = useParams<{ code: string }>();

  const { loginWithRedirect } = useAuth0();

  // Check for an invalid code - fire and forget and don't delay rendering since
  // this is not security-critical, it's just nicer to fail now instead of after registration.
  useEffect(() => {
    const requestController = new AbortController();
    fetch(`${API_BASE_URL}/users/invites/${code}`, {
      headers: {
        accept: 'application/json',
      },
      signal: requestController.signal,
    })
      .then(({ status }) => {
        if (status >= 400 && status < 500) {
          history.replace('/');
        }
      })
      .catch();

    return () => requestController.abort();
  }, [history, code]);

  const createAccount = () => {
    /* eslint-disable @typescript-eslint/camelcase */
    loginWithRedirect({
      prompt: 'login',
      screen_hint: 'signup',
      invitation_code: code,
    });
  };

  return <WelcomePage signup onClick={createAccount} />;
};

export default Welcome;
