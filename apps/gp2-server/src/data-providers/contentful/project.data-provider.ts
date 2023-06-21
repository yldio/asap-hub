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
import { FetchOptions, gp2 as gp2Model } from '@asap-hub/model';
import { ProjectDataProvider } from '../types/project.data-provider.type';
import {
  deleteResources,
  parseCalendar,
  parseMembers,
  parseMilestones,
  parseResources,
  processResources,
} from './utils';

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
    const res = await this.graphQLClient.request<
      gp2Contentful.FetchProjectsQuery,
      gp2Contentful.FetchProjectsQueryVariables
    >(gp2Contentful.FETCH_PROJECTS, {
      limit: take,
      skip,
    });

    const { projectsCollection } = res;
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

    const { resourceFields, idsToDelete: resourceIdsToDelete } =
      await processResources(
        environment,
        project.resources,
        previousProject,
        previousProjectDataObject?.resources,
      );
    const { memberFields, idsToDelete: memberIdsToDelete } =
      await processMembers(
        environment,
        project.members,
        previousProject,
        previousProjectDataObject?.members,
      );
    const result = await patchAndPublish(previousProject, {
      ...project,
      ...(project.resources && { ...resourceFields }),
      ...(project.members && { ...memberFields }),
    });

    await deleteResources(resourceIdsToDelete, environment);
    await deleteMembers(memberIdsToDelete, environment);
    const fetchEventById = () => this.fetchProjectById(id);
    await pollContentfulGql<gp2Contentful.FetchProjectByIdQuery>(
      result.sys.publishedVersion ?? Infinity,
      fetchEventById,
      'projects',
    );
  }
}

export type GraphQLProject = NonNullable<
  NonNullable<NonNullable<gp2Contentful.FetchProjectByIdQuery>['projects']>
>;

export type GraphQLProjectCalendar = NonNullable<GraphQLProject['calendar']>;

export function parseProjectToDataObject(
  project: GraphQLProject,
): gp2Model.ProjectDataObject {
  const members = parseMembers<gp2Model.ProjectMemberRole>(
    project.membersCollection,
  );
  const milestones = parseMilestones(project.milestonesCollection);
  const resources = parseResources(project.resourcesCollection);
  const calendar = parseCalendar(project.calendar);

  return {
    id: project.sys.id,
    title: project.title ?? '',
    startDate: project.startDate ?? '',
    endDate: project.endDate ?? undefined,
    status: project.status as gp2Model.ProjectStatus,
    projectProposalUrl: project.projectProposal ?? undefined,
    pmEmail: project.pmEmail ?? undefined,
    leadEmail: project.leadEmail ?? undefined,
    description: project.description ?? undefined,
    members,
    keywords: (project.keywords as gp2Model.Keyword[]) ?? [],
    milestones,
    resources,
    traineeProject: project.traineeProject ?? false,
    opportunitiesLink: project.opportunitiesLink ?? undefined,
    calendar,
  };
}
const addNextMember = async (
  environment: Environment,
  members: gp2Model.ProjectUpdateDataObject['members'] | undefined,
): Promise<string[]> => {
  const nextMembers = members?.filter((member) => !member.id);
  if (!nextMembers?.length) {
    return [];
  }
  return Promise.all(
    nextMembers.map(async (member) => {
      const entry = await environment.createEntry('projectMembership', {
        fields: addLocaleToFields({
          role: member.role,
          user: { sys: { id: member.userId, type: 'Link', linkType: 'Entry' } },
        }),
      });
      await entry.publish();
      return entry.sys.id;
    }),
  );
};
const getMemberIdsToDelete = (
  previousEntry: Entry,
  members: gp2Model.ProjectUpdateDataObject['members'] | undefined,
): string[] => {
  const previousMembers = previousEntry.fields.members;
  if (!previousMembers?.['en-US']) {
    return [];
  }
  const existingIds: string[] = previousMembers['en-US'].map(
    ({ sys: { id } }: { sys: { id: string } }) => id,
  );
  const nextIds = (members || []).map(({ id }) => id);

  return existingIds.filter((id) => !nextIds.includes(id));
};
const outUnchangedMembers =
  (previousMembers: gp2Model.ProjectMember[] | undefined) =>
  (member: gp2Model.ProjectMember) => {
    const previousMember = previousMembers?.filter(
      (previous) => previous.userId === member.userId,
    );
    return !(previousMember?.[0]?.role === member.role);
  };
type MemberWithId = gp2Model.ProjectMember & {
  id: string;
};
const updateMembers = async (
  members: gp2Model.ProjectUpdateDataObject['members'] | undefined,
  idsToDelete: string[],
  previousMembers: gp2Model.ProjectMember[] | undefined,
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
  members: gp2Model.ProjectUpdateDataObject['members'] | undefined,
  previousEntry: Entry,
  previousMembers: gp2Model.ProjectMember[] | undefined,
) => {
  const nextMembers: string[] = await addNextMember(environment, members);

  const idsToDelete = getMemberIdsToDelete(previousEntry, members);
  const updatedIds = await updateMembers(
    members,
    idsToDelete,
    previousMembers,
    environment,
  );

  const memberFields = getMemberFields([...nextMembers, ...updatedIds]);
  return { memberFields, idsToDelete };
};
export const deleteMembers = async (
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
