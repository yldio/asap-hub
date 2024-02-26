import {
  addLocaleToFields,
  Environment,
  getLinkEntities,
  getLinkEntity,
  patchAndPublish,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { GraphQLProject } from '../project.data-provider';
import { GraphQLWorkingGroup } from '../working-group.data-provider';
import { getIdsToDelete } from './common';

type MembersItem =
  | GraphQLWorkingGroup['membersCollection']
  | GraphQLProject['membersCollection'];

type MemberItem = NonNullable<NonNullable<MembersItem>['items'][number]>;
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

export const parseMembers = <T extends string>(members: MembersItem) =>
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

const addNextMember = async <T extends string>(
  environment: Environment,
  members: gp2Model.UpdateMember<T>[] | undefined,
  entryName: string,
): Promise<string[]> => {
  const nextMembers = members?.filter((member) => !member.id);
  if (!nextMembers?.length) {
    return [];
  }
  return Promise.all(
    nextMembers.map(async (member) => {
      const entry = await environment.createEntry(entryName, {
        fields: addLocaleToFields({
          role: member.role,
          user: getLinkEntity(member.userId),
        }),
      });
      await entry.publish();
      return entry.sys.id;
    }),
  );
};
const outUnchangedMembers =
  <T extends string>(previousMembers: gp2Model.Member<T>[] | undefined) =>
  (member: gp2Model.Member<T>) => {
    const previousMember = previousMembers?.filter(
      (previous) => previous.id === member.id,
    );
    return !(
      previousMember?.[0]?.role === member.role ||
      previousMember?.[0]?.userId === member.userId
    );
  };
type MemberWithId<T extends string> = gp2Model.Member<T> & {
  id: string;
};
const updateMembers = async <T extends string>(
  members: gp2Model.UpdateMember<T>[] | undefined,
  idsToDelete: string[],
  previousMembers: gp2Model.Member<T>[] | undefined,
  environment: Environment,
): Promise<string[]> => {
  const toUpdate = (members || []).filter(
    (member): member is MemberWithId<T> =>
      !!member.id && !idsToDelete.includes(member.id),
  );
  await Promise.all(
    toUpdate
      .filter(outUnchangedMembers(previousMembers))
      .map(async ({ id, role, userId }) => {
        const updatable = await environment.getEntry(id);
        return patchAndPublish(updatable, {
          role,
          user: getLinkEntity(userId),
        });
      }),
  );
  return toUpdate.map(({ id }) => id);
};
const getMemberFields = (nextMembers: string[]) => ({
  members: getLinkEntities(nextMembers, false),
});
export const processMembers = async <T extends string>(
  environment: Environment,
  members: gp2Model.UpdateMember<T>[] | undefined,
  previousMembers: gp2Model.Member<T>[] | undefined,
  entryName: string,
) => {
  const nextMembers = await addNextMember(environment, members, entryName);

  const idsToDelete = getIdsToDelete(previousMembers, members);
  const updatedIds = await updateMembers(
    members,
    idsToDelete,
    previousMembers,
    environment,
  );

  const fields = getMemberFields([...nextMembers, ...updatedIds]);
  return { fields, idsToDelete };
};
