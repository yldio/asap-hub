import React from 'react';
import { useAuth0 } from '@asap-hub/react-context';
import { WelcomePage } from '@asap-hub/react-components';

const Home: React.FC<{}> = () => {
  const { loginWithRedirect } = useAuth0();

  const signin = () => {
    const { pathname, search, hash } = window.location;
    return loginWithRedirect({
      prompt: 'login',
      appState: {
        targetUrl: pathname + search + hash,
      },
    });
  };
  return <WelcomePage onClick={signin} />;
};

export default Home;
