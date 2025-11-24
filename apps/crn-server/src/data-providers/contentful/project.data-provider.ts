import {
  FETCH_PROJECTS,
  FETCH_PROJECTS_BY_TEAM_ID,
  FETCH_PROJECT_BY_ID,
  FetchProjectByIdQuery,
  FetchProjectByIdQueryVariables,
  FetchProjectsByTeamIdQuery,
  FetchProjectsByTeamIdQueryVariables,
  FetchProjectsQuery,
  FetchProjectsQueryVariables,
  GraphQLClient,
  ProjectsOrder,
} from '@asap-hub/contentful';
import {
  DiscoveryProject,
<<<<<<< HEAD
  DiscoveryProjectDetail,
  FundedTeam,
=======
  FetchPaginationOptions,
>>>>>>> a15bc36fd ([ASAP-1274] - Add new webhook handler to update projects' index at Algolia when updating a team)
  ListProjectDataObject,
  Milestone,
  MilestoneStatus,
  ProjectDataObject,
  ProjectDetailDataObject,
  ProjectMember,
  ProjectStatus,
  ProjectType,
  ResearchTag,
  ResourceProject,
  ResourceProjectDetail,
  SupplementGrantInfo,
  TraineeProject,
  TraineeProjectDetail,
} from '@asap-hub/model';
import { cleanArray, parseUserDisplayName } from '@asap-hub/server-common';
import logger from '../../utils/logger';

import {
  FetchProjectsOptions,
  ProjectDataProvider,
} from '../types/projects.data-provider.types';

// Type guards for Contentful GraphQL responses
export type ProjectItem = NonNullable<FetchProjectByIdQuery['projects']>;

type ProjectsCollectionItem = NonNullable<
  NonNullable<FetchProjectsQuery['projectsCollection']>['items'][number]
>;

export type ProjectMembershipItem = NonNullable<
  NonNullable<ProjectItem['membersCollection']>['items'][number]
>;

<<<<<<< HEAD
=======
export class ProjectContentfulDataProvider implements ProjectDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchById(id: string): Promise<ProjectDataObject | null> {
    try {
      const { projects } = await this.contentfulClient.request<
        FetchProjectByIdQuery,
        FetchProjectByIdQueryVariables
      >(FETCH_PROJECT_BY_ID, { id });

      if (!projects) {
        return null;
      }

      return parseContentfulProject(projects);
    } catch (error) {
      return null;
    }
  }

  async fetch(options: FetchProjectsOptions): Promise<ListProjectDataObject> {
    const { take = 10, skip = 0, search, filter } = options;

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
          ],
        }
      : {};

    const projectTypeQuery = filter?.projectType
      ? {
          projectType_in: Array.isArray(filter.projectType)
            ? filter.projectType.map(normalizeProjectType)
            : [normalizeProjectType(filter.projectType)],
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
      items: cleanArray(projectsCollection.items).map(parseContentfulProject),
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
    const projectMap = new Map<string, ProjectItem>();
    for (const membership of teams.linkedFrom.projectMembershipCollection
      .items) {
      if (!membership) {
        continue;
      }
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
}

// Helper function to normalize project type from Contentful format
const normalizeProjectType = (type: ProjectType): string => `${type} Project`;

// Parse Contentful project to model format
export const parseContentfulProject = (
  item: ProjectItem | ProjectsCollectionItem,
): ProjectDataObject => {
  const projectType = (() => {
    const type = item.projectType || '';
    if (type.includes('Discovery')) {
      return 'Discovery' as ProjectType;
    }
    if (type.includes('Resource')) {
      return 'Resource' as ProjectType;
    }
    if (type.includes('Trainee')) {
      return 'Trainee' as ProjectType;
    }
    return undefined;
  })();
  const status = (item.status || '') as ProjectStatus;
  const tags = cleanArray(item.researchTagsCollection?.items || []).map(
    (tag) => tag.name || '',
  );

  const baseProject = {
    id: item.sys.id,
    title: item.title,
    status,
    startDate: item.startDate,
    endDate: item.endDate,
    tags,
  };

  const members = cleanArray(item.membersCollection?.items || []);

  switch (projectType) {
    case 'Discovery': {
      const team = members.find((m) => m.projectMember?.__typename === 'Teams');
      const teamMember = team?.projectMember;

      if (teamMember?.__typename === 'Teams') {
        return {
          ...baseProject,
          projectType: 'Discovery',
          researchTheme: teamMember.researchTheme?.name || '',
          teamName: teamMember.displayName || '',
          teamId: teamMember.sys?.id,
          inactiveSinceDate: teamMember.inactiveSince || undefined,
        } as DiscoveryProject;
      }

      // Fallback if no team found
      return {
        ...baseProject,
        projectType: 'Discovery',
        researchTheme: '',
        teamName: '',
      } as DiscoveryProject;
    }

    case 'Resource': {
      const team = members.find((m) => m.projectMember?.__typename === 'Teams');
      const isTeamBased = !!team;

      if (isTeamBased && team?.projectMember?.__typename === 'Teams') {
        const teamMember = team.projectMember;
        const teamMembers = members
          .filter((m) => m.projectMember?.__typename === 'Teams')
          .map((m) => parseProjectTeamMember(m));

        return {
          ...baseProject,
          projectType: 'Resource',
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
        projectType: 'Resource',
        resourceType: item.resourceType?.name || '',
        isTeamBased: false,
        members: userMembers,
        googleDriveLink: item.googleDriveLink || undefined,
      } as ResourceProject;
    }

    case 'Trainee': {
      const userMembers = members
        .filter((m) => m.projectMember?.__typename === 'Users')
        .map((m) => parseProjectUserMember(m));

      // First member with "Trainer" or "Project Lead" role is the trainer
      const trainerCandidate = userMembers.find(
        (m) =>
          m.role === 'Project CoLead' ||
          m.role === 'Project Lead' ||
          m.role === 'Project Manager',
      );

      const trainer =
        trainerCandidate ??
        userMembers[0] ??
        ({
          id: `trainer-unknown-${item.sys.id}`,
          displayName: '',
        } as ProjectMember);

      const trainees = userMembers.filter((m) => m.id !== trainer.id);

      return {
        ...baseProject,
        projectType: 'Trainee',
        trainer,
        members: trainees,
      } as TraineeProject;
    }

    default:
      throw new Error(`Unknown project type: ${item.projectType}`);
  }
};

>>>>>>> a15bc36fd ([ASAP-1274] - Add new webhook handler to update projects' index at Algolia when updating a team)
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
  item: ProjectItem | ProjectsCollectionItem,
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

  const baseProject = {
    id: item.sys.id,
    title: item.title,
    status,
    startDate: item.startDate,
    endDate: item.endDate,
    tags,
    researchTags,
    projectId: item.projectId || undefined,
    grantId: item.grantId || undefined,
    applicationNumber: item.applicationNumber || undefined,
    contactEmail: item.contactEmail || undefined,
    projectType: item.projectType as ProjectType,
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

// Parse Contentful project to ProjectDetail format with all additional fields
export const parseContentfulProjectDetail = (
  item: ProjectItem,
): ProjectDetailDataObject => {
  const baseProject = parseContentfulProject(item);
  const { projectType } = baseProject;

  // Parse milestones
  const milestones: Milestone[] = cleanArray(
    item.milestonesCollection?.items || [],
  ).map((milestone) => ({
    id: milestone.sys.id,
    title: milestone.title || '',
    description: milestone.description || '',
    status: (milestone.status || 'Not Started') as MilestoneStatus,
    link: milestone.externalLink || undefined,
  }));

  // Parse original grant
  const originalGrant = {
    originalGrant: item.originalGrant || '',
    originalGrantProposalId: item.proposal?.sys.id || undefined,
  };

  // Parse supplement grant
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

        return {
          ...baseProject,
          ...originalGrant,
          supplementGrant,
          milestones: milestones.length > 0 ? milestones : undefined,
          fundedTeam,
          collaborators: collaborators.length > 0 ? collaborators : undefined,
        } as DiscoveryProjectDetail;
      }

      // Fallback if no team found
      return {
        ...baseProject,
        ...originalGrant,
        supplementGrant,
        milestones: milestones.length > 0 ? milestones : undefined,
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

        return {
          ...baseProject,
          ...originalGrant,
          supplementGrant,
          milestones: milestones.length > 0 ? milestones : undefined,
          fundedTeam,
          collaborators: collaborators.length > 0 ? collaborators : undefined,
        } as ResourceProjectDetail;
      }

      // Parse user members for non-team-based projects
      const userMembers: ProjectMember[] = members
        .filter((m) => m.projectMember?.__typename === 'Users')
        .map((m) => parseProjectUserMember(m));

      return {
        ...baseProject,
        ...originalGrant,
        supplementGrant,
        milestones: milestones.length > 0 ? milestones : undefined,
        members: userMembers.length > 0 ? userMembers : undefined,
      } as ResourceProjectDetail;
    }

    case 'Trainee Project': {
      const allMembers = processTraineeProjectMembers(members);

      return {
        ...baseProject,
        ...originalGrant,
        supplementGrant,
        milestones: milestones.length > 0 ? milestones : undefined,
        members: allMembers,
      } as TraineeProjectDetail;
    }

    // istanbul ignore next - validated by parseContentfulProject
    default:
      throw new Error(`Unknown project type: ${item.projectType}`);
  }
};

export class ProjectContentfulDataProvider implements ProjectDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchById(id: string): Promise<ProjectDataObject | null> {
    try {
      const { projects } = await this.contentfulClient.request<
        FetchProjectByIdQuery,
        FetchProjectByIdQueryVariables
      >(FETCH_PROJECT_BY_ID, { id });

      if (!projects) {
        return null;
      }

      // Return ProjectDetail with all additional fields
      return parseContentfulProjectDetail(projects);
    } catch (error) {
      logger.error('Failed to fetch project by id', { id, error });
      return null;
    }
  }

  async fetch(options: FetchProjectsOptions): Promise<ListProjectDataObject> {
    const { take = 10, skip = 0, search, filter } = options;

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
}
