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

type ProjectsCollectionItem = NonNullable<
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
        .map((m) => parseProjectMember(m));

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
        .map((m) => parseProjectMember(m));

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

// Parse project member from Contentful membership
export const parseProjectMember = (
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

// Calculate project duration
const calculateDuration = (startDate: string, endDate: string): string => {
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
};
