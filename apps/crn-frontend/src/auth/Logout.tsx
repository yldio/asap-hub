import { useAuth0CRN } from '@asap-hub/react-context';
import { useEffect } from 'react';

const Logout: React.FC<Record<string, never>> = () => {
  const { loading, logout } = useAuth0CRN();

  useEffect(() => {
    if (!loading) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      logout({ returnTo: globalThis.location.origin });
    }
  });

  return <>Logging you out ...</>;
};

export default Logout;
