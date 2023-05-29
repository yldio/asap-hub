import {
  addLocaleToFields,
  Entry,
  Environment,
  getEntities,
  gp2 as gp2Contentful,
  GraphQLClient,
  patchAndPublish,
  pollContentfulGql,
} from '@asap-hub/contentful';
import { FetchOptions, gp2 as gp2Model } from '@asap-hub/model';
import { ProjectDataProvider } from '../types/project.data-provider.type';

export class ProjectContentfulDataProvider implements ProjectDataProvider {
  constructor(
    private graphQLClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  private fetchProjectById(id: string) {
    return this.graphQLClient.request<
      gp2Contentful.FetchProjectByIdQuery,
      gp2Contentful.FetchProjectByIdQueryVariables
    >(gp2Contentful.FETCH_PROJECT_BY_ID, { id });
  }
  async fetchById(id: string): Promise<gp2Model.ProjectDataObject | null> {
    const { projects } = await this.fetchProjectById(id);
    return projects ? parseProjectToDataObject(projects) : null;
  }

  async fetch(options: FetchOptions): Promise<gp2Model.ListProjectDataObject> {
    const { take = 10, skip = 0 } = options;
    const { projectsCollection } = await this.graphQLClient.request<
      gp2Contentful.FetchProjectsQuery,
      gp2Contentful.FetchProjectsQueryVariables
    >(gp2Contentful.FETCH_PROJECTS, {
      limit: take,
      skip,
    });

    if (!projectsCollection) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: projectsCollection.total,
      items: projectsCollection.items
        .filter((project): project is GraphQLProject => project !== null)
        .map(parseProjectToDataObject),
    };
  }

  async update(
    id: string,
    project: gp2Model.ProjectUpdateDataObject,
  ): Promise<void> {
    const previousProjectDataObject = await this.fetchById(id);
    const environment = await this.getRestClient();
    const previousProject = await environment.getEntry(id);

    const nextResources: string[] = await addNextResources(
      environment,
      project.resources,
    );

    const idsToDelete = getResourceIdsToDelete(
      previousProject,
      project.resources,
    );
    const updatedIds = await updateResources(
      project.resources,
      idsToDelete,
      previousProjectDataObject?.resources,
      environment,
    );

    const resourceFields = getResourceFields([...nextResources, ...updatedIds]);
    const result = await patchAndPublish(previousProject, {
      ...project,
      ...resourceFields,
    });

    await deleteResources(idsToDelete, environment);
    const fetchEventById = () => this.fetchProjectById(id);
    await pollContentfulGql<gp2Contentful.FetchProjectByIdQuery>(
      result.sys.publishedVersion || Infinity,
      fetchEventById,
      'projects',
    );
  }
}

export type GraphQLProject = NonNullable<
  NonNullable<NonNullable<gp2Contentful.FetchProjectByIdQuery>['projects']>
>;

export type GraphQLProjectMember = NonNullable<
  NonNullable<GraphQLProject['membersCollection']>
>['items'][number];

type GraphQLProjectMemberUser = NonNullable<
  NonNullable<GraphQLProjectMember>['user']
>;
type GraphQLProjectMemberRole = NonNullable<GraphQLProjectMember>['role'];

export type GraphQLProjectMilestone = NonNullable<
  NonNullable<
    NonNullable<GraphQLProject['milestonesCollection']>
  >['items'][number]
>;

export type GraphQLProjectResource = NonNullable<
  NonNullable<GraphQLProject['resourcesCollection']>
>['items'][number];

export type GraphQLProjectCalendar = NonNullable<GraphQLProject['calendar']>;

const parseProjectMembers = (
  user: GraphQLProjectMemberUser,
  role: GraphQLProjectMemberRole,
) => {
  if (!(role && gp2Model.isProjectMemberRole(role))) {
    throw new TypeError('Invalid role received');
  }

  return {
    userId: user.sys.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    avatarUrl: user.avatar?.url || undefined,
    role,
  };
};

export function parseProjectToDataObject(
  project: GraphQLProject,
): gp2Model.ProjectDataObject {
  if (!(project.status && gp2Model.isProjectStatus(project.status))) {
    throw new TypeError('status is unknown');
  }
  const members =
    project.membersCollection?.items.reduce(
      (membersList: gp2Model.ProjectMember[], member: GraphQLProjectMember) => {
        const user = member?.user;
        if (!(user && member.role && user.onboarded)) {
          return membersList;
        }

        const groupMember = parseProjectMembers(user, member.role);
        return [...membersList, groupMember];
      },
      [],
    ) || [];

  if (project.keywords && !project.keywords.every(gp2Model.isKeyword)) {
    throw new TypeError('Invalid keyword received from Squidex');
  }
  const milestones =
    project.milestonesCollection?.items
      ?.filter(
        (milestone): milestone is GraphQLProjectMilestone => milestone !== null,
      )
      .map(
        ({
          status,
          title,
          externalLink,
          description,
        }: GraphQLProjectMilestone) => {
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
    project.resourcesCollection?.items.reduce(parseResources, []) || [];
  const calendar = project.calendar
    ? {
        id: project.calendar.sys.id,
        name: project.calendar.name || '',
      }
    : undefined;
  return {
    id: project.sys.id,
    title: project.title || '',
    startDate: project.startDate || '',
    endDate: project.endDate || undefined,
    status: project.status,
    projectProposalUrl: project.projectProposal || undefined,
    pmEmail: project.pmEmail || undefined,
    leadEmail: project.leadEmail || undefined,
    description: project.description || undefined,
    members,
    keywords: project.keywords || [],
    milestones,
    resources,
    traineeProject: project.traineeProject || false,
    opportunitiesLink: project.opportunitiesLink || undefined,
    calendar,
  };
}

const parseResources = (
  resourceList: gp2Model.Resource[],
  resource: GraphQLProjectResource,
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
  resources: gp2Model.ProjectUpdateDataObject['resources'],
): Promise<string[]> => {
  const nextResources = resources?.filter((resource) => !resource.id);
  if (!(nextResources && nextResources.length > 0)) {
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
  previousProject: Entry,
  resources: gp2Model.ProjectUpdateDataObject['resources'],
): string[] => {
  const previousResources = previousProject.fields.resources;
  if (!(previousResources && previousResources['en-US'])) {
    return [];
  }
  const existingIds: string[] = previousResources['en-US'].map(
    ({ sys: { id } }: { sys: { id: string } }) => id,
  );
  const nextIds = (resources || []).map(({ id }) => id);

  return existingIds.filter((id) => !nextIds.includes(id));
};

const deleteResources = async (
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
  resources: gp2Model.ProjectUpdateDataObject['resources'],
  idsToDelete: string[],
  previousResources: gp2Model.ProjectDataObject['resources'],
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
  (previousResources: gp2Model.ProjectDataObject['resources']) =>
  (resource: NonNullable<gp2Model.ProjectDataObject['resources']>[number]) => {
    const previousResource = previousResources?.filter(
      (previous) => previous.id === resource.id,
    );
    return !(
      previousResource &&
      previousResource[0] &&
      previousResource[0].type === resource.type &&
      previousResource[0].title === resource.title &&
      previousResource[0].description === resource.description &&
      (gp2Model.isResourceLink(previousResource[0]) &&
        previousResource[0].externalLink) ===
        (gp2Model.isResourceLink(resource) && resource.externalLink)
    );
  };
