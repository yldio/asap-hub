import { Frame } from '@asap-hub/frontend-utils';
import { UtilityBar, WelcomePage } from '@asap-hub/react-components';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useHistory, useLocation } from 'react-router-dom';

const Signin: React.FC<Record<string, never>> = () => {
  const { loginWithRedirect } = useAuth0CRN();

  const { pathname, search, hash } = useLocation();
  const searchParams = new URLSearchParams(search);
  const history = useHistory();

  const getAuthFailureCode = (
    error: boolean,
    errorDescription: string | null,
  ): 'alumni' | 'invalid' | undefined => {
    if (!error) return undefined;
    if (errorDescription === 'alumni-user-access-denied') return 'alumni';
    return 'invalid';
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
          authFailed={getAuthFailureCode(
            searchParams.has('state') && searchParams.has('error'),
            searchParams.get('error_description'),
          )}
          onCloseAuthFailedToast={() => {
            const newSearchParams = new URLSearchParams(
              history.location.search,
            );
            newSearchParams.delete('state');
            newSearchParams.delete('error');
            newSearchParams.delete('error_description');
            history.replace({ search: newSearchParams.toString() });
          }}
        />
      </UtilityBar>
    </Frame>
  );
};

export default Signin;
