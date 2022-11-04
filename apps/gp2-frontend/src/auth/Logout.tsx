import { useEffect } from 'react';
import { useAuth0GP2 } from '@asap-hub/react-context';

const Logout: React.FC<Record<string, never>> = () => {
  const { loading, logout } = useAuth0GP2();

  useEffect(() => {
    if (!loading) {
      logout({ returnTo: globalThis.location.origin });
    }
  });

  return <>Logging you out ...</>;
};

export default Logout;
