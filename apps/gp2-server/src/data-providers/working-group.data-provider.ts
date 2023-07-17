import {
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
  parseRichText,
  patchAndPublish,
  pollContentfulGql,
  RichTextFromQuery,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  deleteEntries,
  parseCalendar,
  parseMembers,
  parseMilestones,
  parseResources,
  processMembers,
  processResources,
} from './transformers';
import { WorkingGroupDataProvider } from './types';

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
    const doNotProcessEntity = { fields: {}, idsToDelete: [] };

    const { fields: resourceFields, idsToDelete: resourceIdsToDelete } =
      workingGroup.resources
        ? await processResources(
            environment,
            workingGroup.resources,
            previousWorkingGroupDataObject?.resources,
          )
        : doNotProcessEntity;
    const { fields: memberFields, idsToDelete: memberIdsToDelete } =
      workingGroup.members
        ? await processMembers<gp2Model.WorkingGroupMemberRole>(
            environment,
            workingGroup.members,
            previousWorkingGroupDataObject?.members,
            'workingGroupMembership',
          )
        : doNotProcessEntity;

    const previousWorkingGroup = await environment.getEntry(id);
    const result = await patchAndPublish(previousWorkingGroup, {
      ...workingGroup,
      ...resourceFields,
      ...memberFields,
    });

    await deleteEntries(
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
    description: workingGroup.description
      ? parseRichText(workingGroup.description as RichTextFromQuery)
      : '',
    primaryEmail: workingGroup.primaryEmail ?? undefined,
    secondaryEmail: workingGroup.secondaryEmail ?? undefined,
    leadingMembers: workingGroup.leadingMembers ?? '',
    members,
    milestones,
    resources,
    calendar,
  };
};
