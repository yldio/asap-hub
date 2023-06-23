import {
  Environment,
  gp2 as gp2Contentful,
  GraphQLClient,
  patchAndPublish,
  pollContentfulGql,
} from '@asap-hub/contentful';
import { FetchOptions, gp2 as gp2Model } from '@asap-hub/model';
import { ProjectDataProvider } from '../types/project.data-provider.type';
import {
  deleteEntries,
  parseCalendar,
  parseMembers,
  parseMilestones,
  parseResources,
  processMembers,
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
    const doNotProcessEntity = { fields: {}, idsToDelete: [] };

    const { fields: resourceFields, idsToDelete: resourceIdsToDelete } =
      project.resources
        ? await processResources(
            environment,
            project.resources,
            previousProjectDataObject?.resources,
          )
        : doNotProcessEntity;
    const { fields: memberFields, idsToDelete: memberIdsToDelete } =
      project.members
        ? await processMembers<gp2Model.ProjectMemberRole>(
            environment,
            project.members,
            previousProjectDataObject?.members,
            'projectMembership',
          )
        : doNotProcessEntity;
    const previousProject = await environment.getEntry(id);
    const result = await patchAndPublish(previousProject, {
      ...project,
      ...resourceFields,
      ...memberFields,
    });

    await deleteEntries(
      [...resourceIdsToDelete, ...memberIdsToDelete],
      environment,
    );
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
