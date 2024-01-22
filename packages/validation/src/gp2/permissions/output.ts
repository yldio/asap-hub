import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Auth } from '@asap-hub/auth';

type AssociationType = 'Projects' | 'WorkingGroups' | undefined;
type UserInput =
  | Omit<gp2Auth.User, 'algoliaApiKey'>
  | gp2Model.UserResponse
  | null;

type UserRole =
  | gp2Model.ProjectMemberRole
  | gp2Model.WorkingGroupMemberRole
  | undefined;

export const getUserRole = (
  user: UserInput,
  association: AssociationType,
  associationId: string | undefined,
): UserRole =>
  user
    ? association === 'Projects'
      ? user.projects
          .filter((proj: gp2Model.UserProject) => proj.id === associationId)[0]
          ?.members.filter(
            (member: gp2Model.UserProjectMember) => member.userId === user.id,
          )[0]?.role
      : user.workingGroups
          .filter((wg: gp2Model.UserWorkingGroup) => wg.id === associationId)[0]
          ?.members.filter(
            (member: gp2Model.UserWorkingGroupMember) =>
              member.userId === user.id,
          )[0]?.role
    : undefined;
