/* istanbul ignore file */
import type { gp2 as gp2Auth } from '@asap-hub/auth';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { authTestUtils } from '@asap-hub/react-components';
import { Auth0ContextGP2, useAuth0GP2 } from '@asap-hub/react-context';
import { ComponentProps } from 'react';

const { Auth0Provider, WhenReady, LoggedIn } = authTestUtils;

type UserAuth0ProviderProps = Pick<
  ComponentProps<typeof authTestUtils.Auth0Provider<gp2Auth.User>>,
  'children'
>;
export const UserAuth0Provider = ({ children }: UserAuth0ProviderProps) => (
  <Auth0Provider<gp2Auth.User> AuthContext={Auth0ContextGP2}>
    {children}
  </Auth0Provider>
);

type UserWhenReadyProps = Pick<
  ComponentProps<typeof authTestUtils.WhenReady<gp2Auth.User>>,
  'children'
>;
export const UserWhenReady = ({ children }: UserWhenReadyProps) => (
  <WhenReady<gp2Auth.User> useAuth0={useAuth0GP2}>{children}</WhenReady>
);

type UserLoggedInProps = Pick<
  ComponentProps<typeof authTestUtils.LoggedIn<gp2Auth.User>>,
  'children' | 'user'
>;
export const UserLoggedIn = ({ children, user }: UserLoggedInProps) => (
  <LoggedIn
    user={user}
    useAuth0={useAuth0GP2}
    createAuthUser={gp2Fixtures.createAuthUser}
    AuthContext={Auth0ContextGP2}
  >
    {children}
  </LoggedIn>
);
