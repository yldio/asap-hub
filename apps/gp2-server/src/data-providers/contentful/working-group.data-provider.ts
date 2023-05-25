import {
  addLocaleToFields,
  Entry,
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
  Link,
  patchAndPublish,
  pollContentfulGql,
  VersionedLink,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import { isResourceLink } from '@asap-hub/model/src/gp2';
import { WorkingGroupDataProvider } from '../types/working-group.data-provider.type';

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
      total: workingGroupsCollection?.total,
      items: workingGroupsCollection?.items
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
    // const previousWorkingGroupDataObject = await this.fetchById(id)
    const environment = await this.getRestClient();
    const previousWorkingGroup = await environment.getEntry(id);
    const nextResources: string[] = await addNextResources(
      environment,
      workingGroup.resources.filter((resource) => !resource.id),
    );

    const idsToDelete = getResourceIdsToDelete(
      previousWorkingGroup,
      workingGroup,
    );
    const updatedIds = await updateResources(
      workingGroup,
      idsToDelete,
      environment,
    );

    const resourceFields = getResourceFields([...nextResources, ...updatedIds]);
    const result = await patchAndPublish(previousWorkingGroup, {
      ...workingGroup,
      ...resourceFields,
    });

    await deleteResources(idsToDelete, environment);
    const fetchEventById = () => this.fetchWorkingGroupById(id);
    await pollContentfulGql<gp2Contentful.FetchWorkingGroupByIdQuery>(
      result.sys.publishedVersion || Infinity,
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

export type GraphQLWorkingGroupMember = NonNullable<
  NonNullable<GraphQLWorkingGroup['membersCollection']>
>['items'][number];

type GraphQLWorkingGroupMemberUser = NonNullable<
  NonNullable<GraphQLWorkingGroupMember>['user']
>;
type GraphQLWorkingGroupMemberRole =
  NonNullable<GraphQLWorkingGroupMember>['role'];

export type GraphQLWorkingGroupMilestone = NonNullable<
  NonNullable<
    NonNullable<GraphQLWorkingGroup['milestonesCollection']>
  >['items'][number]
>;

export type GraphQLWorkingGroupResource = NonNullable<
  NonNullable<GraphQLWorkingGroup['resourcesCollection']>
>['items'][number];

export type GraphQLWorkingGroupCalendar = NonNullable<
  GraphQLWorkingGroup['calendar']
>;

const parseWorkingGroupMembers = (
  user: GraphQLWorkingGroupMemberUser,
  role: GraphQLWorkingGroupMemberRole,
): gp2Model.WorkingGroupMember => {
  if (!(role && gp2Model.isWorkingGroupMemberRole(role))) {
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

export function parseWorkingGroupToDataObject(
  workingGroup: GraphQLWorkingGroup,
): gp2Model.WorkingGroupDataObject {
  const members =
    workingGroup.membersCollection?.items.reduce(
      (
        membersList: gp2Model.WorkingGroupMember[],
        member: GraphQLWorkingGroupMember,
      ) => {
        const user = member?.user;
        if (!(user && member.role && user.onboarded)) {
          return membersList;
        }
        const groupMember = parseWorkingGroupMembers(user, member.role);
        return [...membersList, groupMember];
      },
      [],
    ) || [];

  const milestones =
    workingGroup.milestonesCollection?.items
      ?.filter(
        (milestone): milestone is GraphQLWorkingGroupMilestone =>
          milestone !== null,
      )
      .map(
        ({
          status,
          title,
          externalLink,
          description,
        }: GraphQLWorkingGroupMilestone) => {
          if (!(status && gp2Model.isMilestoneStatus(status))) {
            throw new TypeError('milestone status is unknown');
          }

          return {
            title: title || '',
            status,
            link: externalLink || undefined,
            description: description || undefined,
          };
        },
      ) || [];

  const resources =
    workingGroup.resourcesCollection?.items?.reduce(parseResources, []) || [];

  const calendar = workingGroup.calendar
    ? {
        id: workingGroup.calendar.sys.id,
        name: workingGroup.calendar.name || '',
      }
    : undefined;

  return {
    id: workingGroup.sys.id,
    title: workingGroup.title || '',
    shortDescription: workingGroup.shortDescription || '',
    description: workingGroup.description || '',
    primaryEmail: workingGroup.primaryEmail || undefined,
    secondaryEmail: workingGroup.secondaryEmail || undefined,
    leadingMembers: workingGroup.leadingMembers || '',
    members,
    milestones,
    resources,
    calendar,
  };
}

export function parseResources(
  resourceList: gp2Model.Resource[],
  resource: GraphQLWorkingGroupResource,
): gp2Model.Resource[] {
  if (
    !(resource?.title && resource.type) ||
    (resource.type === 'Link' && !resource.externalLink)
  ) {
    return resourceList;
  }

  const parsedResource = {
    id: resource.sys.id,
    title: resource.title,
    description: resource.description || undefined,
  };
  if (resource.type === 'Note') {
    return [
      ...resourceList,
      {
        type: 'Note' as const,
        ...parsedResource,
      },
    ];
  }
  const externalLink = resource.externalLink || '';
  return [
    ...resourceList,
    {
      type: 'Link' as const,
      ...parsedResource,
      externalLink,
    },
  ];
}
const addNextResources = async (
  environment: Environment,
  nextResources?: gp2Model.WorkingGroupUpdateDataObject['resources'],
): Promise<string[]> => {
  if (nextResources && nextResources.length > 0) {
    const nextContributingCohorts = await Promise.all(
      nextResources.map(async (resource) => {
        const entry = await environment.createEntry('resources', {
          fields: addLocaleToFields({
            type: resource.type,
            title: resource.title,
            description: resource.description,
            externalLink: isResourceLink(resource)
              ? resource.externalLink
              : undefined,
          }),
        });
        await entry.publish();
        return entry.sys.id;
      }),
    );

    return nextContributingCohorts;
  }
  return [];
};

const getEntities = <Version extends boolean>(
  entities: string[],
  version?: Version,
) => entities.map((id) => getLinkEntity<Version>(id, version));

function getLinkEntity<Version extends boolean>(
  id: string,
  x?: Version,
): Version extends true ? VersionedLink<'Entry'> : Link<'Entry'>;
function getLinkEntity(id: string, version: boolean = false): unknown {
  return {
    sys: {
      type: 'Link' as const,
      linkType: 'Entry' as const,
      id,
      ...(version ? { version: 1 } : {}),
    },
  };
}
const getResourceFields = (nextResources: string[] | undefined) =>
  nextResources
    ? {
        resources: getEntities(nextResources),
      }
    : {};

const getResourceIdsToDelete = (
  previousWorkingGroup: Entry,
  workingGroup: gp2Model.WorkingGroupUpdateDataObject,
): string[] => {
  const previousResources = previousWorkingGroup.fields.resources;
  if (!(previousResources && previousResources['en-US'])) {
    return [];
  }
  const existingIds = previousResources['en-US'].map(
    ({ sys: { id } }: { sys: { id: string } }) => id,
  );
  const nextIds = workingGroup.resources.map(({ id }) => id);

  return existingIds.filter((id: string) => !nextIds.includes(id));
};

const deleteResources = async (
  idsToDelete: string[],
  environment: Environment,
) =>
  Promise.all(
    idsToDelete.map(async (id) => {
      const deletable = await environment.getEntry(id);
      await deletable.unpublish();
      await deletable.delete();
    }),
  );

const updateResources = async (
  workingGroup: gp2Model.WorkingGroupUpdateDataObject,
  idsToDelete: string[],
  environment: Environment,
): Promise<string[]> =>
  Promise.all(
    workingGroup.resources
      .filter(
        (resource: { id?: string }) =>
          !!resource.id && !idsToDelete.includes(resource.id),
      )
      .map(async ({ id, ...resource }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const updatable = await environment.getEntry(id!);
        await patchAndPublish(updatable, { ...resource });
        return id || '';
      }),
  );
