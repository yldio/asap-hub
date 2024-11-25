import { UtilityBar, WelcomePage } from '@asap-hub/react-components';
import { useAuth0GP2 } from '@asap-hub/react-context';
import { useHistory, useLocation } from 'react-router-dom';
import Frame from '../Frame';

const Signin: React.FC<Record<string, never>> = () => {
  const { loginWithRedirect } = useAuth0GP2();

  const { pathname, search, hash } = useLocation();
  const searchParams = new URLSearchParams(search);
  const history = useHistory();

  const values = {
    signup: {
      title: 'Join the GP2 Hub',
      content: 'Activate your account and start exploring the GP2 Network.',
      buttonText: 'Activate account',
    },
    welcome: {
      title: 'Welcome to the  GP2 Hub',
      content:
        'A private, invite-only network where the GP2 community collaborates.',
      buttonText: 'Sign in',
    },
  };

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
