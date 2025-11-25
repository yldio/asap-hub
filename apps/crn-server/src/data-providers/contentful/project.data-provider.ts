import {
  FETCH_PROJECTS,
  FETCH_PROJECT_BY_ID,
  FetchProjectByIdQuery,
  FetchProjectByIdQueryVariables,
  FetchProjectsQuery,
  FetchProjectsQueryVariables,
  GraphQLClient,
  ProjectsOrder,
} from '@asap-hub/contentful';
import {
  DiscoveryProject,
  DiscoveryProjectDetail,
  FundedTeam,
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
        trainer,
        members: trainees,
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
      return {
        ...baseProject,
        ...originalGrant,
        supplementGrant,
        milestones: milestones.length > 0 ? milestones : undefined,
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
