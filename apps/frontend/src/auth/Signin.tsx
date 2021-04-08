import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useAuth0 } from '@asap-hub/react-context';
import { WelcomePage } from '@asap-hub/react-components';

import Frame from '../structure/Frame';

const Signin: React.FC<Record<string, never>> = () => {
  const { loginWithRedirect } = useAuth0();

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
    </Frame>
  );
};

export default Signin;
