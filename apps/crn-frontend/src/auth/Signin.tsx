import { Frame } from '@asap-hub/frontend-utils';
import { UtilityBar, WelcomePage } from '@asap-hub/react-components';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useNavigate, useLocation } from 'react-router-dom';

const Signin: React.FC<Record<string, never>> = () => {
  const { loginWithRedirect } = useAuth0CRN();

  const location = useLocation();
  const { pathname, search, hash } = location;
  const searchParams = new URLSearchParams(search);
  const navigate = useNavigate();

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
            const newSearchParams = new URLSearchParams(location.search);
            newSearchParams.delete('state');
            newSearchParams.delete('error');
            newSearchParams.delete('error_description');
            navigate({ search: newSearchParams.toString() } as never, { replace: true });
          }}
        />
      </UtilityBar>
    </Frame>
  );
};

export default Signin;
