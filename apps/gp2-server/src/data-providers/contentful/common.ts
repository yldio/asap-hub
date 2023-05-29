import {
  addLocaleToFields,
  Entry,
  Environment,
  getEntities,
  gp2 as gp2Contentful,
  patchAndPublish,
} from '@asap-hub/contentful';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  GraphQLProjectMember,
  GraphQLProjectMilestone,
} from './project.data-provider';
import {
  GraphQLWorkingGroupMember,
  GraphQLWorkingGroupMilestone,
} from './working-group.data-provider';

export type GraphQLProject = NonNullable<
  NonNullable<NonNullable<gp2Contentful.FetchProjectByIdQuery>['projects']>
>;

export type GraphQLProjectResource = NonNullable<
  NonNullable<GraphQLProject['resourcesCollection']>
>['items'][number];

export type GraphQLWorkingGroup = NonNullable<
  NonNullable<
    NonNullable<gp2Contentful.FetchWorkingGroupByIdQuery>['workingGroups']
  >
>;
export type GraphQLWorkingGroupResource = NonNullable<
  NonNullable<GraphQLWorkingGroup['resourcesCollection']>
>['items'][number];
export const parseResources = (
  resourceList: gp2Model.Resource[],
  resource: GraphQLWorkingGroupResource | GraphQLProjectResource,
): gp2Model.Resource[] => {
  if (
    !(resource?.title && resource.type) ||
    (resource.type === 'Link' && !resource.externalLink)
  ) {
    return resourceList;
  }

  return [
    ...resourceList,
    {
      id: resource.sys.id,
      title: resource.title,
      description: resource.description || undefined,
      ...(resource.type === 'Note'
        ? { type: 'Note' }
        : {
            type: 'Link',
            externalLink: resource.externalLink || '',
          }),
    },
  ];
};

const addNextResources = async (
  environment: Environment,
  resources: gp2Model.Resource[] | undefined,
): Promise<string[]> => {
  const nextResources = resources?.filter((resource) => !resource.id);
  if (!nextResources?.length) {
    return [];
  }
  return Promise.all(
    nextResources.map(async (resource) => {
      const entry = await environment.createEntry('resources', {
        fields: addLocaleToFields({
          type: resource.type,
          title: resource.title,
          description: resource.description,
          externalLink: gp2Model.isResourceLink(resource)
            ? resource.externalLink
            : undefined,
        }),
      });
      await entry.publish();
      return entry.sys.id;
    }),
  );
};
const getResourceFields = (nextResources: string[]) => ({
  resources: getEntities(nextResources, false),
});
const getResourceIdsToDelete = (
  previousWorkingGroup: Entry,
  resources: gp2Model.Resource[] | undefined,
): string[] => {
  const previousResources = previousWorkingGroup.fields.resources;
  if (!previousResources?.['en-US']) {
    return [];
  }
  const existingIds: string[] = previousResources['en-US'].map(
    ({ sys: { id } }: { sys: { id: string } }) => id,
  );
  const nextIds = (resources || []).map(({ id }) => id);

  return existingIds.filter((id) => !nextIds.includes(id));
};

export const deleteResources = async (
  idsToDelete: string[],
  environment: Environment,
) =>
  Promise.all(
    idsToDelete.map(async (id) => {
      const deletable = await environment.getEntry(id);
      await deletable.unpublish();
      return deletable.delete();
    }),
  );

type ResourceWithId = gp2Model.Resource & {
  id: string;
};
const updateResources = async (
  resources: gp2Model.Resource[] | undefined,
  idsToDelete: string[],
  previousResources: gp2Model.Resource[] | undefined,
  environment: Environment,
): Promise<string[]> => {
  const toUpdate = (resources || []).filter(
    (resource): resource is ResourceWithId =>
      !!resource.id && !idsToDelete.includes(resource.id),
  );
  await Promise.all(
    toUpdate
      .filter(outUnchangedResources(previousResources))
      .map(async ({ id, ...resource }) => {
        const updatable = await environment.getEntry(id);
        return patchAndPublish(updatable, { ...resource });
      }),
  );
  return toUpdate.map(({ id }) => id);
};

const outUnchangedResources =
  (previousResources: gp2Model.Resource[] | undefined) =>
  (resource: gp2Model.Resource) => {
    const previousResource = previousResources?.filter(
      (previous) => previous.id === resource.id,
    );
    return !(
      previousResource?.[0]?.type === resource.type &&
      previousResource[0].title === resource.title &&
      previousResource[0].description === resource.description &&
      (gp2Model.isResourceLink(previousResource[0]) &&
        previousResource[0].externalLink) ===
        (gp2Model.isResourceLink(resource) && resource.externalLink)
    );
  };

export const processResources = async (
  environment: Environment,
  resources: gp2Model.Resource[] | undefined,
  previousWorkingGroup: Entry,
  previousResources: gp2Model.Resource[] | undefined,
) => {
  const nextResources: string[] = await addNextResources(
    environment,
    resources,
  );

  const idsToDelete = getResourceIdsToDelete(previousWorkingGroup, resources);
  const updatedIds = await updateResources(
    resources,
    idsToDelete,
    previousResources,
    environment,
  );

  const resourceFields = getResourceFields([...nextResources, ...updatedIds]);
  return { resourceFields, idsToDelete };
};

type GraphQLProjectMemberUser = NonNullable<
  NonNullable<GraphQLProjectMember>['user']
>;
type GraphQLWorkingGroupMemberUser = NonNullable<
  NonNullable<GraphQLWorkingGroupMember>['user']
>;

export const parseMember = <T extends string>(
  user: GraphQLProjectMemberUser | GraphQLWorkingGroupMemberUser,
  role: string,
  isRole: (a: string) => a is T,
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
  isRole: (a: string) => a is T,
) =>
  members?.items.reduce((membersList: gp2Model.Member<T>[], member) => {
    const user = member?.user;
    if (!(user && member.role && user.onboarded)) {
      return membersList;
    }
    const groupMember = parseMember(user, member.role, isRole);
    return [...membersList, groupMember];
  }, []) || [];

export const parseMilestone = ({
  status,
  title,
  externalLink,
  description,
}: GraphQLProjectMilestone | GraphQLWorkingGroupMilestone) => {
  if (!(status && gp2Model.isMilestoneStatus(status))) {
    throw new TypeError('milestone status is unknown');
  }

  return {
    title: title || '',
    status,
    link: externalLink || undefined,
    description: description || undefined,
  };
};
