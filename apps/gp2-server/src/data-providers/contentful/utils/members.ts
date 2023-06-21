import { gp2 as gp2Model } from '@asap-hub/model';
import { GraphQLProject } from '../project.data-provider';
import { GraphQLWorkingGroup } from '../working-group.data-provider';

type MembersItem =
  | GraphQLWorkingGroup['membersCollection']
  | GraphQLProject['membersCollection'];

type MemberItem = NonNullable<NonNullable<MembersItem>['items'][number]>;
export type Member = gp2Model.ProjectDataObject['members'][number];
const parseMember = <T extends string>(
  id: string,
  user: NonNullable<MemberItem['user']>,
  role: MemberItem['role'],
): {
  id: string;
  userId: string;
  role: T;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
} => ({
  id,
  userId: user.sys.id,
  role: (role ?? '') as T,
  firstName: user.firstName ?? '',
  lastName: user.lastName ?? '',
  avatarUrl: user.avatar?.url ?? undefined,
});

export const parseMembers = <T extends string>(
  members:
    | GraphQLWorkingGroup['membersCollection']
    | GraphQLProject['membersCollection'],
) =>
  members?.items
    .filter((member): member is MemberItem => member !== null)
    .reduce((membersList: gp2Model.Member<T>[], member) => {
      const user = member?.user;
      if (!user?.onboarded) {
        return membersList;
      }
      const groupMember = parseMember<T>(member.sys.id, user, member.role);
      return [...membersList, groupMember];
    }, []) || [];
