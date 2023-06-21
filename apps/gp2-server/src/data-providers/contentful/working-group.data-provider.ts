import {
  addLocaleToFields,
  Entry,
  Environment,
  getLinkEntities,
  getLinkEntity,
  gp2 as gp2Contentful,
  GraphQLClient,
  patchAndPublish,
  pollContentfulGql,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { WorkingGroupDataProvider } from '../types/working-group.data-provider.type';
import {
  deleteEntities,
  getIdsToDelete,
  parseCalendar,
  parseMembers,
  parseMilestones,
  parseResources,
  processResources,
} from './utils';

export class WorkingGroupContentfulDataProvider
  implements WorkingGroupDataProvider
{
  constructor(
    private graphQLClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetch(): Promise<gp2Model.ListWorkingGroupDataObject> {
    const { workingGroupsCollection } = await this.graphQLClient.request<
      gp2Contentful.FetchWorkingGroupsQuery,
      gp2Contentful.FetchWorkingGroupsQueryVariables
    >(gp2Contentful.FETCH_WORKING_GROUPS, {});

    if (!workingGroupsCollection) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: workingGroupsCollection.total,
      items: workingGroupsCollection.items
        .filter(
          (workingGroup): workingGroup is GraphQLWorkingGroup =>
            workingGroup !== null,
        )
        .map(parseWorkingGroupToDataObject),
    };
  }
  async update(
    id: string,
    workingGroup: gp2Model.WorkingGroupUpdateDataObject,
  ): Promise<void> {
    const previousWorkingGroupDataObject = await this.fetchById(id);
    const environment = await this.getRestClient();
    const previousWorkingGroup = await environment.getEntry(id);

    const { resourceFields, idsToDelete: resourceIdsToDelete } =
      await processResources(
        environment,
        workingGroup.resources,
        previousWorkingGroup,
        previousWorkingGroupDataObject?.resources,
      );
    const { memberFields, idsToDelete: memberIdsToDelete } =
      await processMembers(
        environment,
        workingGroup.members,
        previousWorkingGroup,
        previousWorkingGroupDataObject?.members,
      );
    const result = await patchAndPublish(previousWorkingGroup, {
      ...workingGroup,
      ...(workingGroup.resources && { ...resourceFields }),
      ...(workingGroup.members && { ...memberFields }),
    });

    await deleteEntities(
      [...resourceIdsToDelete, ...memberIdsToDelete],
      environment,
    );
    const fetchEventById = () => this.fetchWorkingGroupById(id);
    await pollContentfulGql<gp2Contentful.FetchWorkingGroupByIdQuery>(
      result.sys.publishedVersion ?? Infinity,
      fetchEventById,
      'workingGroups',
    );
  }

  private fetchWorkingGroupById(id: string) {
    return this.graphQLClient.request<
      gp2Contentful.FetchWorkingGroupByIdQuery,
      gp2Contentful.FetchWorkingGroupByIdQueryVariables
    >(gp2Contentful.FETCH_WORKING_GROUP_BY_ID, { id });
  }
  async fetchById(id: string) {
    const { workingGroups } = await this.fetchWorkingGroupById(id);

    return workingGroups ? parseWorkingGroupToDataObject(workingGroups) : null;
  }
}
export type GraphQLWorkingGroup = NonNullable<
  NonNullable<
    NonNullable<gp2Contentful.FetchWorkingGroupByIdQuery>['workingGroups']
  >
>;

export const parseWorkingGroupToDataObject = (
  workingGroup: GraphQLWorkingGroup,
): gp2Model.WorkingGroupDataObject => {
  const members = parseMembers<gp2Model.WorkingGroupMemberRole>(
    workingGroup.membersCollection,
  );
  const milestones = parseMilestones(workingGroup.milestonesCollection);
  const resources = parseResources(workingGroup.resourcesCollection);
  const calendar = parseCalendar(workingGroup.calendar);

  return {
    id: workingGroup.sys.id,
    title: workingGroup.title ?? '',
    shortDescription: workingGroup.shortDescription ?? '',
    description: workingGroup.description ?? '',
    primaryEmail: workingGroup.primaryEmail ?? undefined,
    secondaryEmail: workingGroup.secondaryEmail ?? undefined,
    leadingMembers: workingGroup.leadingMembers ?? '',
    members,
    milestones,
    resources,
    calendar,
  };
};
const addNextMember = async (
  environment: Environment,
  members: gp2Model.WorkingGroupUpdateDataObject['members'] | undefined,
): Promise<string[]> => {
  const nextMembers = members?.filter((member) => !member.id);
  if (!nextMembers?.length) {
    return [];
  }
  return Promise.all(
    nextMembers.map(async (member) => {
      const entry = await environment.createEntry('workingGroupMembership', {
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
  (previousMembers: gp2Model.WorkingGroupMember[] | undefined) =>
  (member: gp2Model.WorkingGroupMember) => {
    const previousMember = previousMembers?.filter(
      (previous) => previous.id === member.id,
    );
    return !(
      previousMember?.[0]?.role === member.role ||
      previousMember?.[0]?.userId === member.userId
    );
  };
type MemberWithId = gp2Model.WorkingGroupMember & {
  id: string;
};
const updateMembers = async (
  members: gp2Model.WorkingGroupUpdateDataObject['members'] | undefined,
  idsToDelete: string[],
  previousMembers: gp2Model.WorkingGroupMember[] | undefined,
  environment: Environment,
): Promise<string[]> => {
  const toUpdate = (members || []).filter(
    (member): member is MemberWithId =>
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
const processMembers = async (
  environment: Environment,
  members: gp2Model.WorkingGroupUpdateDataObject['members'] | undefined,
  previousEntry: Entry,
  previousMembers: gp2Model.WorkingGroupMember[] | undefined,
) => {
  const nextMembers = await addNextMember(environment, members);

  const idsToDelete = getIdsToDelete(previousEntry, members, 'members');
  const updatedIds = await updateMembers(
    members,
    idsToDelete,
    previousMembers,
    environment,
  );

  const memberFields = getMemberFields([...nextMembers, ...updatedIds]);
  return { memberFields, idsToDelete };
};
