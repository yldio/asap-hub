/* istanbul ignore file */
import type { gp2 as gp2Auth } from '@asap-hub/auth';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { authTestUtils } from '@asap-hub/react-components';
import { Auth0ContextGP2, useAuth0GP2 } from '@asap-hub/react-context';
import { ComponentProps } from 'react';

const {
  Auth0Provider: Auth0ProviderBase,
  WhenReady: WhenReadyBase,
  LoggedInBase,
} = authTestUtils;

type Auth0ProviderProps = Pick<
  ComponentProps<typeof authTestUtils.Auth0Provider<gp2Auth.User>>,
  'children'
>;
export const Auth0Provider = ({ children }: Auth0ProviderProps) => (
  <Auth0ProviderBase<gp2Auth.User> AuthContext={Auth0ContextGP2}>
    {children}
  </Auth0ProviderBase>
);

type WhenReadyProps = Pick<
  ComponentProps<typeof authTestUtils.WhenReady<gp2Auth.User>>,
  'children'
>;
export const WhenReady = ({ children }: WhenReadyProps) => (
  <WhenReadyBase<gp2Auth.User> useAuth0={useAuth0GP2}>{children}</WhenReadyBase>
);

type LoggedInProps = Pick<
  ComponentProps<typeof authTestUtils.LoggedInBase<gp2Auth.User>>,
  'children' | 'user'
>;
export const LoggedIn = ({ children, user }: LoggedInProps) => (
  <LoggedInBase
    user={user}
    useAuth0={useAuth0GP2}
    mockUser={gp2Fixtures.createAuthUser}
    AuthContext={Auth0ContextGP2}
  >
    {children}
  </LoggedInBase>
);
