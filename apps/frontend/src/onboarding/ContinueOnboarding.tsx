import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@asap-hub/react-context';

import { STORAGE_KEY_INVITATION_CODE, API_BASE_URL } from '../config';

const ContinueOnboarding: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => {
  const {
    isAuthenticated,
    loading: auth0Loading,
    getTokenSilently,
  } = useAuth0();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestController = new AbortController();
    const connect = async (code: string): Promise<void> => {
      const token = await getTokenSilently();
      try {
        const { status } = await fetch(`${API_BASE_URL}/users/connections`, {
          headers: {
            accept: 'application/json',
          },
          body: JSON.stringify({
            code,
            token,
          }),
          method: 'POST',
          signal: requestController.signal,
        });

        if (status >= 300) {
          // TODO: handle error
        }
      } catch (error) {
        // TODO: handle error
      }
    };

    if (auth0Loading) {
      return undefined;
    }

    const code = window.sessionStorage.getItem(STORAGE_KEY_INVITATION_CODE);
    if (isAuthenticated && code !== null) {
      window.sessionStorage.removeItem(STORAGE_KEY_INVITATION_CODE);
      connect(code).then(() => {
        history.replace('/create-profile');
      });
    }
    setLoading(false);
    return () => requestController.abort();
  }, [auth0Loading, isAuthenticated, history, getTokenSilently]);

  return loading ? null : <>{children}</>;
};

export default ContinueOnboarding;
