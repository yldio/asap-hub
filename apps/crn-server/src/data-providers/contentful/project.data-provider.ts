import {
  addLocaleToFields,
  Environment,
  FETCH_PROJECTS,
  FETCH_PROJECTS_BY_MEMBERSHIP_ID,
  FETCH_PROJECTS_BY_TEAM_ID,
  FETCH_PROJECTS_BY_USER_ID,
  FETCH_PROJECT_BY_ID,
  FetchProjectByIdQuery,
  FetchProjectByIdQueryVariables,
  FetchProjectsByMembershipIdQuery,
  FetchProjectsByMembershipIdQueryVariables,
  FetchProjectsByTeamIdQuery,
  FetchProjectsByTeamIdQueryVariables,
  FetchProjectsByUserIdQuery,
  FetchProjectsByUserIdQueryVariables,
  FetchProjectsQuery,
  FetchProjectsQueryVariables,
  GraphQLClient,
  patchAndPublish,
  ProjectsOrder,
} from '@asap-hub/contentful';
import {
  Aim,
  AimStatus,
  DiscoveryProject,
  FetchPaginationOptions,
  DiscoveryProjectDetail,
  FundedTeam,
  ListProjectDataObject,
  ProjectDataObject,
  ProjectDetailDataObject,
  ProjectMember,
  ProjectStatus,
  ProjectTool,
  ProjectType,
  ResearchTag,
  ResourceProject,
  ResourceProjectDetail,
  SupplementGrantInfo,
  TraineeProject,
  TraineeProjectDetail,
  ProjectStatusRank,
  FetchProjectMilestonesOptions,
  ListProjectMilestonesResponse,
  OpensearchHitsResponse,
  Milestone,
  MilestoneStatus,
  milestoneStatuses,
} from '@asap-hub/model';
import {
  cleanArray,
  parseUserDisplayName,
  OpensearchRequest,
} from '@asap-hub/server-common';
import { getCleanProjectTools } from '../../utils/project';
import logger from '../../utils/logger';
import OpensearchProvider from '../opensearch.data-provider';
import { deriveAimStatus } from '../../utils/aim-status';

import {
  FetchProjectsOptions,
  ProjectDataProvider,
  ProjectUpdateDataObject,
} from '../types/projects.data-provider.types';
import { ProjectMilestonesDataObject } from '../../../scripts/opensearch/types';

// Type guards for Contentful GraphQL responses
export type ProjectItem = NonNullable<FetchProjectByIdQuery['projects']>;

type ProjectsCollectionItem = NonNullable<
  NonNullable<FetchProjectsQuery['projectsCollection']>['items'][number]
>;

export type ProjectMembershipItem = NonNullable<
  NonNullable<ProjectItem['membersCollection']>['items'][number]
>;

type AimsCollectionItem = {
  sys: { id: string };
  description?: string | null;
  milestonesCollection?: {
    items: Array<{
      status?: string | null;
      relatedArticlesCollection?: { total: number } | null;
    } | null>;
  } | null;
};

export const parseContentfulAims = (
  items: Array<AimsCollectionItem | null> | undefined,
): Aim[] | undefined => {
  if (!items) return undefined;

  const aims = items
    .filter(
      (item): item is AimsCollectionItem =>
        item !== null && !!item.description?.trim(),
    )
    .map(
      (item, index) =>
        ({
          id: item.sys.id,
          order: index + 1,
          description: item.description?.trim() ?? '',
          status: deriveAimStatus(item.milestonesCollection?.items),
          articleCount: (item.milestonesCollection?.items ?? []).reduce(
            (sum: number, m) =>
              sum + (m?.relatedArticlesCollection?.total ?? 0),
            0,
          ),
        }) satisfies Aim,
    );

  return aims.length > 0 ? aims : undefined;
};

// Parse project member from Contentful membership
export const parseProjectUserMember = (
  membership: ProjectMembershipItem,
): ProjectMember => {
  const { projectMember } = membership;

  if (!projectMember || projectMember.__typename !== 'Users') {
    return {
      id: `unknown-user-${membership.sys?.id ?? 'missing'}`,
      displayName: '',
    };
  }

  return {
    id: projectMember.sys.id,
    displayName: parseUserDisplayName(
      projectMember.firstName || '',
      projectMember.lastName || '',
      undefined,
      projectMember.nickname || '',
    ),
    firstName: projectMember.firstName || undefined,
    lastName: projectMember.lastName || undefined,
    avatarUrl: projectMember.avatar?.url || undefined,
    role: membership.role || undefined,
    email: projectMember.email || undefined,
    alumniSinceDate: projectMember.alumniSinceDate || undefined,
  };
};

export const parseProjectTeamMember = (
  membership: ProjectMembershipItem,
): ProjectMember => {
  const { projectMember } = membership;

  if (!projectMember || projectMember.__typename !== 'Teams') {
    return {
      id: `unknown-team-${membership.sys?.id ?? 'missing'}`,
      displayName: '',
    };
  }

  return {
    id: projectMember.sys.id,
    displayName: projectMember.displayName || '',
  };
};

// Process Trainee Project members: filter by valid roles and separate into trainees and mentors
export const processTraineeProjectMembers = (
  members: ProjectMembershipItem[],
): ProjectMember[] => {
  // Only valid roles for Trainee Projects:
  // - Trainees: "Trainee Project - Lead"
  // - Mentors/Trainers: "Trainee Project - Mentor" or "Trainee Project - Key Personnel"
  const userMembers = members
    .filter((m) => m.projectMember?.__typename === 'Users')
    .map((m) => parseProjectUserMember(m))
    .filter(
      (m) =>
        m.role === 'Trainee Project - Lead' ||
        m.role === 'Trainee Project - Mentor' ||
        m.role === 'Trainee Project - Key Personnel',
    );

  // Separate members into two lists:
  // - Trainees: "Trainee Project - Lead"
  // - Mentors/Trainers: "Trainee Project - Mentor" or "Trainee Project - Key Personnel"
  const trainees = userMembers.filter(
    (m) => m.role === 'Trainee Project - Lead',
  );
  const mentors = userMembers.filter(
    (m) =>
      m.role === 'Trainee Project - Mentor' ||
      m.role === 'Trainee Project - Key Personnel',
  );

  // Members array: trainees first, then mentors (allows multiple of each)
  return [...trainees, ...mentors];
};

// Parse Contentful project to model format
export const parseContentfulProject = (
  item: ProjectsCollectionItem,
): ProjectDataObject => {
  const status = (item.status || '') as ProjectStatus;

  // Parse research tags with full metadata
  const researchTagsArray = cleanArray(
    item.researchTagsCollection?.items || [],
  );
  const tags = researchTagsArray.map((tag) => tag.name || '');
  const researchTags: ResearchTag[] = researchTagsArray.map((tag) => ({
    id: tag.sys.id,
    name: tag.name || '',
    category: tag.category || undefined,
    types: tag.types ? cleanArray(tag.types) : undefined,
  }));

  const tools: ProjectTool[] = cleanArray(
    item.toolsCollection?.items || [],
  ).reduce((acc: ProjectTool[], tool) => {
    if (!tool || !tool.name || !tool.url) {
      return acc;
    }
    return [
      ...acc,
      {
        id: tool.sys?.id,
        name: tool.name,
        url: tool.url,
        description: tool.description ?? undefined,
      },
    ];
  }, []);

  const baseProject = {
    id: item.sys.id,
    title: item.title,
    status,
    statusRank: ProjectStatusRank[status],
    startDate: item.startDate,
    endDate: item.endDate,
    tags,
    researchTags,
    projectId: item.projectId || undefined,
    grantId: item.grantId || undefined,
    applicationNumber: item.applicationNumber || undefined,
    contactEmail: item.contactEmail || undefined,
    projectType: item.projectType as ProjectType,
    originalGrant: item.originalGrant || '',
    supplementGrantDescription: item.supplementGrant?.description || '',
    tools: tools.length > 0 ? tools : undefined,
  };

  const members = cleanArray(item.membersCollection?.items || []);

  switch (item.projectType) {
    case 'Discovery Project': {
      const team = members.find((m) => m.projectMember?.__typename === 'Teams');
      const teamMember = team?.projectMember;

      if (teamMember?.__typename === 'Teams') {
        return {
          ...baseProject,
          researchTheme: teamMember.researchTheme?.name || '',
          teamName: teamMember.displayName || '',
          teamId: teamMember.sys?.id,
          inactiveSinceDate: teamMember.inactiveSince || undefined,
        } as DiscoveryProject;
      }

      // Fallback if no team found
      return {
        ...baseProject,
        researchTheme: '',
        teamName: '',
      } as DiscoveryProject;
    }

    case 'Resource Project': {
      const team = members.find((m) => m.projectMember?.__typename === 'Teams');
      const isTeamBased = !!team;

      if (isTeamBased && team?.projectMember?.__typename === 'Teams') {
        const teamMember = team.projectMember;
        const teamMembers = members
          .filter((m) => m.projectMember?.__typename === 'Teams')
          .map((m) => parseProjectTeamMember(m));

        return {
          ...baseProject,
          resourceType: item.resourceType?.name || '',
          isTeamBased: true,
          teamName: teamMember.displayName || '',
          teamId: teamMember.sys?.id,
          googleDriveLink: item.googleDriveLink || undefined,
          members: teamMembers,
        } as ResourceProject;
      }

      const userMembers = members
        .filter((m) => m.projectMember?.__typename === 'Users')
        .map((m) => parseProjectUserMember(m));

      return {
        ...baseProject,
        resourceType: item.resourceType?.name || '',
        isTeamBased: false,
        members: userMembers,
        googleDriveLink: item.googleDriveLink || undefined,
      } as ResourceProject;
    }

    case 'Trainee Project': {
      const allMembers = processTraineeProjectMembers(members);

      return {
        ...baseProject,
        members: allMembers,
      } as TraineeProject;
    }

    default:
      throw new Error(`Unknown project type: ${item.projectType}`);
  }
};

// Manuscript parsing types and helpers
type ProjectManuscriptItem = {
  sys: { id: string };
  status?: string | null;
  teamsCollection?: {
    items: Array<{ sys: { id: string } } | null>;
  } | null;
};

type ProjectMemberWithLinkedManuscripts = NonNullable<
  ProjectMembershipItem['projectMember']
> & {
  linkedFrom?: {
    manuscriptsCollection?: {
      items: Array<ProjectManuscriptItem | null>;
    };
  };
};

const sortProjectManuscripts = (manuscripts: ProjectManuscriptItem[]) => {
  const STATUS_PRIORITY: Record<'Compliant' | 'Closed (other)', number> = {
    Compliant: 1,
    'Closed (other)': 2,
  };
  return [...manuscripts].sort((a, b) => {
    const aPriority =
      STATUS_PRIORITY[a.status as keyof typeof STATUS_PRIORITY] ?? 0;
    const bPriority =
      STATUS_PRIORITY[b.status as keyof typeof STATUS_PRIORITY] ?? 0;
    return aPriority - bPriority;
  });
};

const getManuscriptItemsFromProjectMember = (
  projectMember: NonNullable<ProjectMembershipItem['projectMember']>,
): ProjectManuscriptItem[] => {
  const memberWithLinkedFrom =
    projectMember as ProjectMemberWithLinkedManuscripts;
  return cleanArray(
    memberWithLinkedFrom.linkedFrom?.manuscriptsCollection?.items,
  );
};

const deduplicateProjectManuscripts = (
  manuscriptItems: ProjectManuscriptItem[],
): ProjectManuscriptItem[] =>
  manuscriptItems.filter(
    (manuscript, index, items) =>
      items.findIndex(({ sys }) => sys.id === manuscript.sys.id) === index,
  );

const parseProjectManuscripts = (
  manuscriptItems: ProjectManuscriptItem[],
  teamId: string,
) => {
  const teamManuscripts = manuscriptItems.filter(
    (manuscript) => manuscript.teamsCollection?.items[0]?.sys.id === teamId,
  );
  const collaborationManuscripts = manuscriptItems.filter(
    (manuscript) => manuscript.teamsCollection?.items[0]?.sys.id !== teamId,
  );
  return {
    manuscripts: sortProjectManuscripts(teamManuscripts).map((m) => m.sys.id),
    collaborationManuscripts: sortProjectManuscripts(
      collaborationManuscripts,
    ).map((m) => m.sys.id),
  };
};

// Parse Contentful project to ProjectDetail format with all additional fields
export const parseContentfulProjectDetail = (
  item: ProjectItem,
): ProjectDetailDataObject => {
  const baseProject = parseContentfulProject(item);
  const { projectType } = baseProject;

  const originalGrantProposalId = item.proposal?.sys.id || undefined;

  const supplementGrant: SupplementGrantInfo | undefined = item.supplementGrant
    ? {
        grantTitle: item.supplementGrant.title || '',
        grantDescription: item.supplementGrant.description || '',
        grantProposalId: item.supplementGrant.proposal?.sys.id || undefined,
        grantStartDate: item.supplementGrant.startDate || undefined,
        grantEndDate: item.supplementGrant.endDate || undefined,
      }
    : undefined;

  const members = cleanArray(item.membersCollection?.items || []);

  switch (projectType) {
    case 'Discovery Project': {
      const team = members.find((m) => m.projectMember?.__typename === 'Teams');
      const teamMember = team?.projectMember;

      if (teamMember?.__typename === 'Teams') {
        // Parse funded team
        const fundedTeam: FundedTeam = {
          id: teamMember.sys?.id,
          displayName: teamMember.displayName || '',
          teamType: 'Discovery Team',
          researchTheme: teamMember.researchTheme?.name || undefined,
          teamDescription: teamMember.teamDescription || undefined,
        };

        // Parse collaborators (user members)
        const collaborators: ProjectMember[] = members
          .filter((m) => m.projectMember?.__typename === 'Users')
          .map((m) => parseProjectUserMember(m));

        // Parse manuscripts from team's linkedFrom
        const manuscriptItems = getManuscriptItemsFromProjectMember(teamMember);
        const { manuscripts, collaborationManuscripts } =
          parseProjectManuscripts(manuscriptItems, teamMember.sys.id);

        return {
          ...baseProject,
          originalGrantProposalId,
          supplementGrant,
          fundedTeam,
          collaborators: collaborators.length > 0 ? collaborators : undefined,
          manuscripts,
          collaborationManuscripts,
        } as DiscoveryProjectDetail;
      }

      // Fallback if no team found
      return {
        ...baseProject,
        originalGrantProposalId,
        supplementGrant,
      } as DiscoveryProjectDetail;
    }

    case 'Resource Project': {
      const team = members.find((m) => m.projectMember?.__typename === 'Teams');
      const isTeamBased = !!team;

      if (isTeamBased && team?.projectMember?.__typename === 'Teams') {
        const teamMember = team.projectMember;
        const fundedTeam: FundedTeam | undefined = {
          id: teamMember.sys?.id,
          displayName: teamMember.displayName || '',
          teamType: 'Resource Team',
          researchTheme: teamMember.researchTheme?.name || undefined,
          teamDescription: teamMember.teamDescription || undefined,
        };

        const collaborators: ProjectMember[] = members
          .filter((m) => m.projectMember?.__typename === 'Users')
          .map((m) => parseProjectUserMember(m));

        // Parse manuscripts from team's linkedFrom
        const resourceManuscriptItems =
          getManuscriptItemsFromProjectMember(teamMember);
        const {
          manuscripts: resourceManuscripts,
          collaborationManuscripts: resourceCollaborationManuscripts,
        } = parseProjectManuscripts(resourceManuscriptItems, teamMember.sys.id);

        return {
          ...baseProject,
          originalGrantProposalId,
          supplementGrant,
          fundedTeam,
          collaborators: collaborators.length > 0 ? collaborators : undefined,
          manuscripts: resourceManuscripts,
          collaborationManuscripts: resourceCollaborationManuscripts,
        } as ResourceProjectDetail;
      }

      // Parse user members for non-team-based projects
      const userMembers: ProjectMember[] = members
        .filter((m) => m.projectMember?.__typename === 'Users')
        .map((m) => parseProjectUserMember(m));

      const manuscripts = sortProjectManuscripts(
        deduplicateProjectManuscripts(
          members.flatMap((member) =>
            member.projectMember?.__typename === 'Users'
              ? getManuscriptItemsFromProjectMember(member.projectMember)
              : [],
          ),
        ),
      ).map((manuscript) => manuscript.sys.id);

      return {
        ...baseProject,
        originalGrantProposalId,
        supplementGrant,
        members: userMembers.length > 0 ? userMembers : undefined,
        manuscripts,
      } as ResourceProjectDetail;
    }

    case 'Trainee Project': {
      const allMembers = processTraineeProjectMembers(members);
      const manuscripts = sortProjectManuscripts(
        deduplicateProjectManuscripts(
          members.flatMap((member) =>
            member.projectMember?.__typename === 'Users'
              ? getManuscriptItemsFromProjectMember(member.projectMember)
              : [],
          ),
        ),
      ).map((manuscript) => manuscript.sys.id);

      return {
        ...baseProject,
        originalGrantProposalId,
        supplementGrant,
        members: allMembers,
        manuscripts,
      } as TraineeProjectDetail;
    }

    // istanbul ignore next - validated by parseContentfulProject
    default:
      throw new Error(`Unknown project type: ${item.projectType}`);
  }
};

const createAndPublishProjectTools = (
  environment: Environment,
  tools: ProjectTool[],
) =>
  Promise.all(
    tools.map(async (tool) => {
      const { id, ...toolFields } = tool;
      const entry = id
        ? await environment
            .getEntry(id)
            .then((e: Awaited<ReturnType<typeof environment.getEntry>>) => {
              e.fields = addLocaleToFields(toolFields);
              return e.update();
            })
        : await environment.createEntry('externalTools', {
            fields: addLocaleToFields(toolFields),
          });
      return entry.publish();
    }),
  );

export class ProjectContentfulDataProvider implements ProjectDataProvider {
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient?: () => Promise<Environment>,
    private opensearchProvider?: OpensearchProvider,
  ) {}

  private async fetchMilestonesLastUpdated(
    projectId: string,
    grantType: 'original' | 'supplement',
  ): Promise<string | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const response = await this.opensearchProvider!.search({
      index: 'project-milestones',
      body: {
        query: {
          bool: {
            filter: [{ term: { projectId } }, { term: { grantType } }],
          },
        },
        aggs: {
          last_milestone_update: { max: { field: 'lastDate' } },
        },
        size: 0,
      } satisfies OpensearchRequest,
    });

    const agg = response.aggregations?.last_milestone_update as
      | { value_as_string?: string }
      | undefined;

    return agg?.value_as_string;
  }

  private async fetchAimsByProjectId(
    projectId: string,
    grantType: 'original' | 'supplement',
  ): Promise<
    Array<{
      id: string;
      description: string;
      status: string;
      articleCount: number;
    }>
  > {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const response = await this.opensearchProvider!.search({
      index: 'project-aims',
      body: {
        query: {
          bool: {
            filter: [{ term: { projectId } }, { term: { grantType } }],
          },
        },
        sort: [{ aimOrder: { order: 'asc', missing: '_last' } }],
        size: 50,
      } satisfies OpensearchRequest,
    });

    return (
      (
        (response.hits?.hits as unknown as Array<{
          _source: {
            id: string;
            description: string;
            status: string;
            articleCount: number;
          };
        }>) ?? []
      )
        // eslint-disable-next-line no-underscore-dangle
        .map((hit) => hit._source)
    );
  }

  async fetchById(id: string): Promise<ProjectDataObject | null> {
    try {
      const [
        { projects },
        originalAimsHits,
        supplementAimsHits,
        originalMilestonesLastUpdated,
        supplementMilestonesLastUpdated,
      ] = await Promise.all([
        this.contentfulClient.request<
          FetchProjectByIdQuery,
          FetchProjectByIdQueryVariables
        >(FETCH_PROJECT_BY_ID, { id }),
        this.fetchAimsByProjectId(id, 'original'),
        this.fetchAimsByProjectId(id, 'supplement'),
        this.fetchMilestonesLastUpdated(id, 'original'),
        this.fetchMilestonesLastUpdated(id, 'supplement'),
      ]);

      if (!projects) {
        return null;
      }

      const toAims = (
        hits: Array<{
          id: string;
          description: string;
          status: string;
          articleCount: number;
        }>,
      ): ReadonlyArray<Aim> | undefined => {
        if (hits.length === 0) return undefined;
        return hits.map((hit, index) => ({
          id: hit.id,
          order: index + 1,
          description: hit.description,
          status: hit.status as AimStatus,
          articleCount: hit.articleCount,
        }));
      };

      const baseResult = parseContentfulProjectDetail(projects);
      const originalGrantAims = toAims(originalAimsHits);
      const supplementGrant = baseResult.supplementGrant
        ? {
            ...baseResult.supplementGrant,
            aims: toAims(supplementAimsHits),
          }
        : undefined;

      const milestonesLastUpdated = {
        ...(originalMilestonesLastUpdated && {
          original: originalMilestonesLastUpdated,
        }),
        ...(supplementMilestonesLastUpdated && {
          supplement: supplementMilestonesLastUpdated,
        }),
      };

      return {
        ...baseResult,
        originalGrantAims,
        supplementGrant,
        milestonesLastUpdated:
          Object.keys(milestonesLastUpdated).length > 0
            ? milestonesLastUpdated
            : undefined,
      } as ProjectDetailDataObject;
    } catch (error) {
      logger.info('error:::', error);

      logger.error('Failed to fetch project by id', { id, error });
      return null;
    }
  }

  async fetch(options: FetchProjectsOptions): Promise<ListProjectDataObject> {
    const { take = 10, skip = 0, search, filter } = options;

    if (filter?.projectMembershipId) {
      const { projectMembership } = await this.contentfulClient.request<
        FetchProjectsByMembershipIdQuery,
        FetchProjectsByMembershipIdQueryVariables
      >(FETCH_PROJECTS_BY_MEMBERSHIP_ID, {
        membershipId: filter.projectMembershipId,
        // It's unlikely that one membership belongs to many projects, but for completeness sake I'm using a safe limit.
        limit: 20,
      });

      if (!projectMembership?.linkedFrom?.projectsCollection?.items) {
        return {
          total: 0,
          items: [],
        };
      }

      const projects =
        projectMembership.linkedFrom.projectsCollection.items.filter(
          (project): project is NonNullable<typeof project> => project !== null,
        );

      const paginatedItems = projects.slice(skip, skip + take);

      return {
        total: projects.length,
        items: paginatedItems.map(parseContentfulProject),
      };
    }

    const searchTerms = (search || '').split(' ').filter(Boolean);
    const searchQuery = searchTerms.length
      ? {
          OR: [
            ...searchTerms.map((term) => ({
              title_contains: term,
            })),
            ...searchTerms.map((term) => ({
              researchTags: { name_contains: term },
            })),
            ...searchTerms.map((term) => ({
              resourceType: { name_contains: term },
            })),
          ],
        }
      : {};

    const projectTypeQuery = filter?.projectType
      ? {
          projectType_in: Array.isArray(filter.projectType)
            ? filter.projectType
            : [filter.projectType],
        }
      : {};

    const statusQuery = filter?.status
      ? {
          status_in: Array.isArray(filter.status)
            ? filter.status
            : [filter.status],
        }
      : {};

    const { projectsCollection } = await this.contentfulClient.request<
      FetchProjectsQuery,
      FetchProjectsQueryVariables
    >(FETCH_PROJECTS, {
      limit: take,
      skip,
      order: [ProjectsOrder.SysFirstPublishedAtDesc],
      where: {
        ...searchQuery,
        ...projectTypeQuery,
        ...statusQuery,
      },
    });

    if (!projectsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: projectsCollection.total,
      items: cleanArray<ProjectsCollectionItem>(projectsCollection.items).map(
        parseContentfulProject,
      ),
    };
  }

  async fetchByTeamId(
    teamId: string,
    options: FetchPaginationOptions,
  ): Promise<ListProjectDataObject> {
    const { take = 10, skip = 0 } = options;

    const { teams } = await this.contentfulClient.request<
      FetchProjectsByTeamIdQuery,
      FetchProjectsByTeamIdQueryVariables
    >(FETCH_PROJECTS_BY_TEAM_ID, {
      teamId,
      limit: 100, // Fetch all memberships, deduplicate in memory as a team may have more than one role per project.
    });

    if (!teams?.linkedFrom?.projectMembershipCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    // Extract projects from memberships and deduplicate by project ID
    const projectMap = new Map<string, ProjectsCollectionItem>();
    const memberships =
      teams.linkedFrom.projectMembershipCollection.items.filter(
        (membership): membership is NonNullable<typeof membership> =>
          membership !== null,
      );
    for (const membership of memberships) {
      const projects = membership.linkedFrom?.projectsCollection?.items || [];
      for (const project of projects) {
        if (project && !projectMap.has(project.sys.id)) {
          projectMap.set(project.sys.id, project);
        }
      }
    }

    const uniqueProjects = Array.from(projectMap.values());

    // Apply pagination in memory on deduplicated projects
    const paginatedItems = uniqueProjects.slice(skip, skip + take);

    return {
      total: uniqueProjects.length,
      items: paginatedItems.map(parseContentfulProject),
    };
  }

  async update(id: string, update: ProjectUpdateDataObject): Promise<void> {
    if (!this.getRestClient) {
      throw new Error(
        'REST client not configured for ProjectContentfulDataProvider',
      );
    }
    const environment = await this.getRestClient();
    const project = await environment.getEntry(id);

    const { tools } = update;
    const cleanTools = getCleanProjectTools(tools);
    const incomingToolIds = cleanTools
      .map((tool: ProjectTool) => tool.id)
      .filter((toolId): toolId is string => !!toolId);

    const currentToolsLinks = project.fields.tools
      ? project.fields.tools['en-US']
      : [];
    const currentToolIds = currentToolsLinks.map(
      (link: { sys: { id: string } }) => link.sys.id,
    );

    const toolsToDelete = currentToolIds.filter(
      (toolId: string) => !incomingToolIds.includes(toolId),
    );

    await Promise.all(
      toolsToDelete.map(async (toolId: string) => {
        const entry = await environment.getEntry(toolId);
        await entry.unpublish();
        await entry.delete();
      }),
    );

    const publishedTools = await createAndPublishProjectTools(
      environment,
      cleanTools,
    );

    await patchAndPublish(project, {
      tools: publishedTools.map((tool: { sys: { id: string } }) => ({
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: tool.sys.id,
        },
      })),
    });
  }

  async fetchByUserId(
    userId: string,
    options: FetchPaginationOptions,
  ): Promise<ListProjectDataObject> {
    const { take = 10, skip = 0 } = options;

    const { users } = await this.contentfulClient.request<
      FetchProjectsByUserIdQuery,
      FetchProjectsByUserIdQueryVariables
    >(FETCH_PROJECTS_BY_USER_ID, {
      userId,
      limit: 100, // Fetch all memberships, deduplicate in memory as a user may have more than one role per project.
    });

    if (!users?.linkedFrom?.projectMembershipCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    // Extract projects from memberships and deduplicate by project ID
    const projectMap = new Map<string, ProjectsCollectionItem>();
    const memberships =
      users.linkedFrom.projectMembershipCollection.items.filter(
        (membership): membership is NonNullable<typeof membership> =>
          membership !== null,
      );
    for (const membership of memberships) {
      const projects = membership.linkedFrom?.projectsCollection?.items || [];
      for (const project of projects) {
        if (project && !projectMap.has(project.sys.id)) {
          projectMap.set(project.sys.id, project);
        }
      }
    }

    const uniqueProjects = Array.from(projectMap.values());

    // Apply pagination in memory on deduplicated projects
    const paginatedItems = uniqueProjects.slice(skip, skip + take);

    return {
      total: uniqueProjects.length,
      items: paginatedItems.map(parseContentfulProject),
    };
  }

  async fetchProjectMilestones(
    id: string,
    options: FetchProjectMilestonesOptions,
  ): Promise<ListProjectMilestonesResponse> {
    if (!this.opensearchProvider) {
      throw new Error(
        'Opensearch Provider not configured for ProjectContentfulDataProvider',
      );
    }
    const { take = 10, skip = 0, grantType, search, filter } = options;
    const normalizedSearch = search?.trim();
    const statusFilters = (filter ?? []).filter(
      (value): value is MilestoneStatus =>
        milestoneStatuses.includes(value as MilestoneStatus),
    );
    const filters = cleanArray([
      { term: { projectId: id } },
      grantType ? { term: { grantType } } : undefined,
      statusFilters.length ? { terms: { status: statusFilters } } : undefined,
    ]);

    const response = (await this.opensearchProvider.search({
      index: 'project-milestones',
      body: {
        query: {
          bool: {
            filter: filters,
            ...(normalizedSearch
              ? {
                  must: [
                    {
                      match: {
                        description: {
                          query: normalizedSearch,
                          fuzziness: 'AUTO',
                          operator: 'and',
                        },
                      },
                    },
                  ],
                }
              : {}),
          },
        },
        sort: [{ aimNumbersAsc: { order: 'asc' } }],
        from: skip,
        size: take,
      } satisfies OpensearchRequest,
    })) as unknown as OpensearchHitsResponse<ProjectMilestonesDataObject>;

    const hits = response.hits?.hits ?? [];

    const items: Milestone[] = hits.map((hit) => {
      // eslint-disable-next-line no-underscore-dangle
      const { aimNumbersAsc, aimNumbersDesc, status, ...fields } = hit._source;

      // till we implement sorting the aims field used will be the one sorted in ascending order
      const isDescAimsSort = false;

      return {
        ...fields,
        aims: isDescAimsSort ? aimNumbersDesc : aimNumbersAsc,
        status: status as MilestoneStatus,
      };
    });

    return {
      total: response.hits?.total?.value || 0,
      items,
    };
  }
}
