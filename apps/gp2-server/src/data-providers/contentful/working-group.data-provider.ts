import {
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
  patchAndPublish,
  pollContentfulGql,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { WorkingGroupDataProvider } from '../types/working-group.data-provider.type';
import {
  deleteResources,
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

    const { resourceFields, idsToDelete } = await processResources(
      environment,
      workingGroup.resources,
      previousWorkingGroup,
      previousWorkingGroupDataObject?.resources,
    );
    const result = await patchAndPublish(previousWorkingGroup, {
      ...workingGroup,
      ...resourceFields,
    });

    await deleteResources(idsToDelete, environment);
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
