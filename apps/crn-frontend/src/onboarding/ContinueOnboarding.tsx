import { useEffect, useState } from 'react';
import { useAuth0CRN } from '@asap-hub/react-context';

const ContinueOnboarding: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => {
  const {
    isAuthenticated,
    loading: auth0Loading,
    getTokenSilently,
  } = useAuth0CRN();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestController = new AbortController();
    if (!auth0Loading) {
      return undefined;
    }

    setLoading(false);
    return () => requestController.abort();
  }, [auth0Loading, isAuthenticated, getTokenSilently]);

  return loading ? null : <>{children}</>;
};

export default ContinueOnboarding;
