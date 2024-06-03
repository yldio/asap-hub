import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0CRN } from '@asap-hub/react-context';

const ContinueOnboarding: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => {
  const {
    isAuthenticated,
    loading: auth0Loading,
    getTokenSilently,
  } = useAuth0CRN();
  const history = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestController = new AbortController();
    if (!auth0Loading) {
      return undefined;
    }

    setLoading(false);
    return () => requestController.abort();
  }, [auth0Loading, isAuthenticated, history, getTokenSilently]);

  return loading ? null : <>{children}</>;
};

export default ContinueOnboarding;
