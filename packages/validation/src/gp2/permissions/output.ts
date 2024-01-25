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
      ? user.projects
          .find((proj: gp2Model.UserProject) => proj.id === associationId)
          ?.members.find(
            (member: gp2Model.UserProjectMember) => member.userId === user.id,
          )?.role
      : user.workingGroups
          .find((wg: gp2Model.UserWorkingGroup) => wg.id === associationId)
          ?.members.find(
            (member: gp2Model.UserWorkingGroupMember) =>
              member.userId === user.id,
          )?.role
    : undefined;
