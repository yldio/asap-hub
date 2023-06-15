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
): {
  userId: string;
  role: T;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
} => {
  return {
    userId: user.sys.id,
    role: role as T,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    avatarUrl: user.avatar?.url || undefined,
  };
};

export const parseMembers = <T extends string>(
  members:
    | GraphQLWorkingGroup['membersCollection']
    | GraphQLProject['membersCollection'],
) =>
  members?.items.reduce((membersList: gp2Model.Member<T>[], member) => {
    const user = member?.user;
    if (!(user && member.role && user.onboarded)) {
      return membersList;
    }
    const groupMember = parseMember<T>(user, member.role);
    return [...membersList, groupMember];
  }, []) || [];
