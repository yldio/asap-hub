import { User } from '@asap-hub/auth';

import { useAuth0 } from './auth0';

export const getUserClaimKey = (): string =>
  new URL('/user', window.location.href).toString();
export const useCurrentUser = (): User | null => {
  const { user: auth0User } = useAuth0();
  if (!auth0User) return null;

  const claimKey = getUserClaimKey();
  const user = auth0User[claimKey];
  if (!user) {
    throw new Error(
      `Auth0 user is missing user claim - expected claim key ${claimKey}, got keys [${Object.keys(
        auth0User,
      ).join(', ')}]`,
    );
  }
  if (typeof user !== 'object') {
    throw new Error(`Invalid user claim - expected object, got ${user}`);
  }

  return user;
};

export const useCurrentUserTeamRoles = (): Array<
  User['teams'][number]['role']
> => {
  const user = useCurrentUser();
  return user ? user.teams.map(({ role }) => role) : [];
};
