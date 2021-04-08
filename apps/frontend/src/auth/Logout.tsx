import React, { useEffect } from 'react';
import { useAuth0 } from '@asap-hub/react-context';

import Frame from '../structure/Frame';

const Logout: React.FC<Record<string, never>> = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout({ returnTo: globalThis.location.origin });
  });

  return <Frame title="Logout">Logging you out ...</Frame>;
};

export default Logout;
