import { gp2 as gp2Model } from '@asap-hub/model';
import { GraphQLProject } from '../project.data-provider';
import { GraphQLWorkingGroup } from '../working-group.data-provider';

export type GraphQLProjectMember = NonNullable<
  NonNullable<GraphQLProject['membersCollection']>
>['items'][number];
type GraphQLProjectMemberUser = NonNullable<
  NonNullable<GraphQLProjectMember>['user']
>;
type GraphQLWorkingGroupMemberUser = NonNullable<
  NonNullable<
    NonNullable<GraphQLWorkingGroup['membersCollection']>['items'][number]
  >['user']
>;

const parseMember = <T extends string>(
  user: GraphQLProjectMemberUser | GraphQLWorkingGroupMemberUser,
  role: string,
  isRole: (role: string) => role is T,
): {
  userId: string;
  role: T;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
} => {
  if (!(role && isRole(role))) {
    throw new TypeError('Invalid role received');
  }

  return {
    userId: user.sys.id,
    role,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    avatarUrl: user.avatar?.url || undefined,
  };
};

export const parseMembers = <T extends string>(
  members:
    | GraphQLWorkingGroup['membersCollection']
    | GraphQLProject['membersCollection'],
  isRole: (role: string) => role is T,
) =>
  members?.items.reduce((membersList: gp2Model.Member<T>[], member) => {
    const user = member?.user;
    if (!(user && member.role && user.onboarded)) {
      return membersList;
    }
    const groupMember = parseMember(user, member.role, isRole);
    return [...membersList, groupMember];
  }, []) || [];
