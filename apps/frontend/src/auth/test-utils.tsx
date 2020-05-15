import React from 'react';
import { User } from '@asap-hub/auth';

import { useAuth0, Auth0Context } from './react-auth0-spa';

export const WhenAuth0Loaded: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loading } = useAuth0();
  return loading ? null : <>{children}</>;
};

export const LoggedIn: React.FC<{
  children: React.ReactNode;
  // undefined user should be explicit, this is for the intermediate state
  // where the getUser() promise is pending.
  user: User | undefined;
}> = ({ children, user }) => {
  const ctx = useAuth0();
  return (
    <Auth0Context.Provider value={{ ...ctx, isAuthenticated: true, user }}>
      {children}
    </Auth0Context.Provider>
  );
};
