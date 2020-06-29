import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@asap-hub/react-context';

import { STORAGE_KEY_INVITATION_CODE } from '../config';

const ContinueOnboarding: React.FC<{
  readonly children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, loading: auth0Loading } = useAuth0();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth0Loading) {
      return;
    }

    if (
      isAuthenticated &&
      window.sessionStorage.getItem(STORAGE_KEY_INVITATION_CODE) !== null
    ) {
      window.sessionStorage.removeItem(STORAGE_KEY_INVITATION_CODE);
      // TODO connect authentication method to user
      history.replace('/create-profile');
    }

    setLoading(false);
  }, [auth0Loading, isAuthenticated, history]);

  return loading ? null : <>{children}</>;
};

export default ContinueOnboarding;
