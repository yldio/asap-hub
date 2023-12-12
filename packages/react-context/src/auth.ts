import { Auth0User, gp2, User } from '@asap-hub/auth';
import { gp2 as gp2Model } from '@asap-hub/model';

import { useAuth0CRN, useAuth0GP2 } from './auth0';

export const getUserClaimKey = (): string =>
  new URL('/user', window.location.href).toString();

export const useCurrentUserCRN = (): User | null => {
  const { user: auth0User } = useAuth0CRN();

  return parseUser(auth0User);
};

export const useCurrentUserGP2 = (): gp2.User | null => {
  const { user: auth0User } = useAuth0GP2();

  return parseUser(auth0User);
};

export const useCurrentUserRoleGP2 = (
  entityId: string | undefined,
  entityType: 'WorkingGroups' | 'Projects' | undefined,
) => {
  const user = useCurrentUserGP2();
  return user
    ? entityType === 'Projects'
      ? user.projects
          .filter((proj: gp2Model.UserProject) => proj.id === entityId)[0]
          ?.members.filter(
            (member: gp2Model.UserProjectMember) => member.userId === user.id,
          )[0]?.role
      : undefined
    : undefined;
};

export const useCurrentUserProjectRolesGP2 =
  (): gp2Model.ProjectMemberRole[] => {
    const user = useCurrentUserGP2();

    return (
      (user?.projects
        .map(
          (project) =>
            project.members.filter((member) => member.userId === user.id)[0]
              ?.role,
        )
        .filter(
          (role) => role !== undefined,
        ) as gp2Model.ProjectMemberRole[]) || []
    );
  };

export const useCurrentUserTeamRolesCRN = (): Array<
  User['teams'][number]['role']
> => {
  const user = useCurrentUserCRN();
  return user ? user.teams.map(({ role }) => role) : [];
};

function parseUser<T>(auth0User: Auth0User<T> | undefined) {
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
}
