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
  ListProjectDataObject,
  ProjectDataObject,
  ProjectMember,
  ProjectStatus,
  ProjectType,
  ResourceProject,
  TraineeProject,
} from '@asap-hub/model';
import { cleanArray, parseUserDisplayName } from '@asap-hub/server-common';
import { DateTime } from 'luxon';

import {
  FetchProjectsOptions,
  ProjectDataProvider,
} from '../types/projects.data-provider.types';

// Type guards for Contentful GraphQL responses
export type ProjectItem = NonNullable<FetchProjectByIdQuery['projects']>;

export type ProjectsCollectionItem = NonNullable<
  NonNullable<FetchProjectsQuery['projectsCollection']>['items'][number]
>;

export type ProjectMembershipItem = NonNullable<
  NonNullable<ProjectItem['membersCollection']>['items'][number]
>;

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
            ? filter.status.map(normalizeStatus)
            : [normalizeStatus(filter.status)],
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

  async create(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async update(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

// Helper function to normalize project type from Contentful format
function normalizeProjectType(type: ProjectType): string {
  return `${type} Project`;
}

// Helper function to normalize status
function normalizeStatus(status: ProjectStatus): string {
  // Contentful uses "Completed" but our model uses "Complete"
  if (status === 'Complete') {
    return 'Completed';
  }
  return status;
}

// Helper function to denormalize status from Contentful
function denormalizeStatus(status: string): ProjectStatus {
  if (status === 'Completed') {
    return 'Complete';
  }
  return status as ProjectStatus;
}

// Parse Contentful project to model format
export function parseContentfulProject(
  item: ProjectItem | ProjectsCollectionItem,
): ProjectDataObject {
  const projectType = extractProjectType(item.projectType || '');
  const status = denormalizeStatus(item.status || '');
  const tags = cleanArray(item.researchTagsCollection?.items || []).map(
    (tag) => tag.name || '',
  );

  const baseProject = {
    id: item.sys.id,
    title: item.title,
    status,
    startDate: item.startDate,
    endDate: item.endDate,
    duration: calculateDuration(item.startDate, item.endDate),
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
        return {
          ...baseProject,
          projectType: 'Resource',
          resourceType: item.resourceType?.name || '',
          isTeamBased: true,
          teamName: teamMember.displayName || '',
          teamId: teamMember.sys?.id,
          googleDriveLink: undefined, // TODO: Add this field to Contentful
        } as ResourceProject;
      }

      const userMembers = members
        .filter((m) => m.projectMember?.__typename === 'Users')
        .map((m) => parseProjectMember(m));

      return {
        ...baseProject,
        projectType: 'Resource',
        resourceType: item.resourceType?.name || '',
        isTeamBased: false,
        members: userMembers,
        googleDriveLink: undefined, // TODO: Add this field to Contentful if needed
      } as ResourceProject;
    }

    case 'Trainee': {
      const userMembers = members
        .filter((m) => m.projectMember?.__typename === 'Users')
        .map((m) => parseProjectMember(m));

      // First member with "Trainer" or "Project Lead" role is the trainer
      const trainer =
        userMembers.find(
          (m) =>
            m.role === 'Trainer' ||
            m.role === 'Project Lead' ||
            m.role === 'Project Manager',
        ) || userMembers[0];

      const trainees = userMembers.filter((m) => m.id !== trainer?.id);

      if (!trainer) {
        throw new Error(`Trainee project ${item.sys.id} has no trainer`);
      }

      return {
        ...baseProject,
        projectType: 'Trainee',
        trainer,
        members: trainees,
      } as TraineeProject;
    }

    default:
      throw new Error(`Unknown project type: ${projectType}`);
  }
}

// Extract project type from Contentful format
function extractProjectType(contentfulType: string): ProjectType {
  if (contentfulType.includes('Discovery')) {
    return 'Discovery';
  }
  if (contentfulType.includes('Resource')) {
    return 'Resource';
  }
  if (contentfulType.includes('Trainee')) {
    return 'Trainee';
  }
  throw new Error(`Unknown project type: ${contentfulType}`);
}

// Parse project member from Contentful membership
function parseProjectMember(membership: ProjectMembershipItem): ProjectMember {
  const { projectMember } = membership;

  if (!projectMember || projectMember.__typename !== 'Users') {
    throw new Error('Project member must be a user');
  }

  return {
    id: projectMember.sys.id,
    displayName: parseUserDisplayName(
      projectMember.firstName || '',
      projectMember.nickname || '',
      projectMember.lastName || '',
    ),
    firstName: projectMember.firstName || undefined,
    lastName: projectMember.lastName || undefined,
    avatarUrl: projectMember.avatar?.url || undefined,
    role: membership.role || undefined,
    email: projectMember.email || undefined,
    alumniSinceDate: projectMember.alumniSinceDate || undefined,
    href: `/users/${projectMember.sys.id}`,
  };
}

// Calculate project duration
function calculateDuration(startDate: string, endDate: string): string {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);

  const duration = end.diff(start, ['years', 'months']);
  const years = Math.floor(duration.years);
  const months = Math.round(duration.months);

  if (years > 0) {
    if (months > 0) {
      return `${years} yr${years > 1 ? 's' : ''} ${months} mo${
        months > 1 ? 's' : ''
      }`;
    }
    return `${years} yr${years > 1 ? 's' : ''}`;
  }

  return `${months} mo${months > 1 ? 's' : ''}`;
}
