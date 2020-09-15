import React, { useEffect } from 'react';
import { useAuth0 } from '@asap-hub/react-context';

const Logout: React.FC<{}> = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout({ returnTo: globalThis.location.origin });
  });

  return <>Logging you out ...</>;
};

export default Logout;
