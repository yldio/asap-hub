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
  deleteResources,
  parseMembers,
  parseMilestone,
  parseResources,
  processResources,
} from './common';

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

    const { resourceFields, idsToDelete } = await processResources(
      environment,
      project.resources,
      previousProject,
      previousProjectDataObject?.resources,
    );
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

export type GraphQLProjectMilestone = NonNullable<
  NonNullable<
    NonNullable<GraphQLProject['milestonesCollection']>
  >['items'][number]
>;

export type GraphQLProjectResource = NonNullable<
  NonNullable<GraphQLProject['resourcesCollection']>
>['items'][number];

export type GraphQLProjectCalendar = NonNullable<GraphQLProject['calendar']>;

export function parseProjectToDataObject(
  project: GraphQLProject,
): gp2Model.ProjectDataObject {
  if (!(project.status && gp2Model.isProjectStatus(project.status))) {
    throw new TypeError('status is unknown');
  }
  const members = parseMembers<gp2Model.ProjectMemberRole>(
    project.membersCollection,
    gp2Model.isProjectMemberRole,
  );

  if (project.keywords && !project.keywords.every(gp2Model.isKeyword)) {
    throw new TypeError('Invalid keyword received from Squidex');
  }
  const milestones =
    project.milestonesCollection?.items
      ?.filter(
        (milestone): milestone is GraphQLProjectMilestone => milestone !== null,
      )
      .map(parseMilestone) || [];

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
