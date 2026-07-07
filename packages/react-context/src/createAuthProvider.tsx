import { Auth0 } from '@asap-hub/auth';
import { Context, FC } from 'react';

import { Auth0SpaProvider } from './Auth0SpaProvider';

interface CreateAuthProviderOptions<TUser> {
  context: Context<Auth0<TUser>>;
  domain: string;
  clientId: string;
  audience: string;
}

export const createAuthProvider = <TUser,>({
  context,
  domain,
  clientId,
  audience,
}: CreateAuthProviderOptions<TUser>): FC<{
  readonly children: React.ReactNode;
}> => {
  const AuthProvider: FC<{ readonly children: React.ReactNode }> = ({
    children,
  }) => (
    <Auth0SpaProvider
      context={context}
      domain={domain}
      client_id={clientId}
      redirect_uri={window.location.origin}
      cacheLocation="localstorage"
      audience={audience}
      useRefreshTokens
    >
      {children}
    </Auth0SpaProvider>
  );

  return AuthProvider;
};
