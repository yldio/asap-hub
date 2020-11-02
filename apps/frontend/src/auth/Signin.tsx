import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth0 } from '@asap-hub/react-context';
import { WelcomePage } from '@asap-hub/react-components';

const Signin: React.FC<{}> = () => {
  const { loginWithRedirect } = useAuth0();

  const { pathname, search, hash } = useLocation();
  const searchParams = new URLSearchParams(search);
  const history = useHistory();

  const signin = () => {
    return loginWithRedirect({
      prompt: 'login',
      appState: {
        targetUrl: pathname + search + hash,
      },
    });
  };
  return (
    <WelcomePage
      onClick={signin}
      authFailed={searchParams.has('state') && searchParams.has('error')}
      onCloseAuthFailedToast={() => {
        const newSearchParams = new URLSearchParams(history.location.search);
        newSearchParams.delete('state');
        newSearchParams.delete('error');
        newSearchParams.delete('error_description');
        history.replace({ search: newSearchParams.toString() });
      }}
    />
  );
};

export default Signin;
