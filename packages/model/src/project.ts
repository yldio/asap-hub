import { ListResponse } from './common';
import { ResearchOutputType } from './research-output';
import { TeamDataObject, TeamRole } from './team';

export type ProjectTool = {
  id?: string;
  name: string;
  description?: string;
  url: string;
};

export type ProjectStatus = 'Active' | 'Completed' | 'Closed';

export const projectTypes = [
  'Discovery Project',
  'Resource Project',
  'Trainee Project',
] as const;

export type ProjectType = (typeof projectTypes)[number];

export const isProjectType = (value: unknown): value is ProjectType =>
  (projectTypes as readonly string[]).includes(value as string);

export type ResearchTag = {
  readonly id: string;
  readonly name: string;
  readonly category?: string;
  readonly types?: ReadonlyArray<string>;
};

export const ProjectStatusRank: Record<ProjectStatus, number> = {
  Active: 1,
  Completed: 2,
  Closed: 3,
};

export type BaseProject = {
  readonly id: string;
  readonly title: string;
  readonly status: ProjectStatus;
  readonly statusRank: number;
  readonly startDate: string;
  readonly endDate: string;
  readonly duration?: string;
  readonly tags: string[];
  readonly projectId?: string;
  readonly grantId?: string;
  readonly applicationNumber?: string;
  readonly contactEmail?: string;
  readonly researchTags?: ReadonlyArray<ResearchTag>;
  readonly originalGrant?: string;
  readonly supplementGrantDescription?: string;
  readonly tools?: ReadonlyArray<ProjectTool>;
  readonly manuscripts?: string[];
  readonly collaborationManuscripts?: string[];
};

export type ProjectMemberTeam = {
  readonly id: string;
  readonly displayName: string;
};

export type ProjectMember = {
  readonly id: string;
  readonly displayName: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatarUrl?: string;
  readonly role?: string;
  readonly email?: string;
  readonly alumniSinceDate?: string;
  readonly href?: string;
  readonly teams?: ReadonlyArray<ProjectMemberTeam>;
};

export type FundedTeam = Pick<
  TeamDataObject,
  'id' | 'displayName' | 'teamType' | 'researchTheme' | 'teamDescription'
>;

export type DiscoveryProject = BaseProject & {
  readonly projectType: 'Discovery Project';
  readonly researchTheme: string;
  readonly teamName: string;
  readonly teamId?: string;
  readonly inactiveSinceDate?: string;
  readonly fundedTeam?: FundedTeam;
};

export type ResourceProject = BaseProject & {
  readonly projectType: 'Resource Project';
  readonly resourceType: string;
  readonly isTeamBased: boolean;
  readonly teamName?: string;
  readonly teamId?: string;
  readonly members?: ReadonlyArray<ProjectMember>;
  readonly googleDriveLink?: string;
  readonly fundedTeam?: FundedTeam;
};

export type TraineeProject = BaseProject & {
  readonly projectType: 'Trainee Project';
  readonly members: ReadonlyArray<ProjectMember>;
};

export type Project = DiscoveryProject | ResourceProject | TraineeProject;

// Milestone types
export type MilestoneStatus =
  | 'Complete'
  | 'In Progress'
  | 'Pending'
  | 'Terminated';

export type ArticleItem = {
  readonly id: string;
  readonly title: string;
  readonly href: string;
  readonly type?: ResearchOutputType;
};

export type Milestone = {
  readonly id: string;
  readonly description: string;
  readonly status: MilestoneStatus;
  /**
   * Optional comma-separated aim numbers for the Aims column (e.g. "1", "1,2", "2,3,4,5,6").
   * Stored as string for OpenSearch sorting.
   */
  readonly aims?: string;
  readonly relatedArticles?: ReadonlyArray<ArticleItem>;
};

// NOTE: this is going to be inferred from the collection
// of associated milestones in ticket https://asaphub.atlassian.net/browse/ASAP-1365
// If redundant, we can remove it, and use MilestoneStatus instead (though AimMilestoneStatus
// might be a better name)
export type AimStatus = 'Complete' | 'In Progress' | 'Pending' | 'Terminated';

export type Aim = {
  readonly id: string;
  readonly order: number; // feel free to remove this property if it can be inferred from the item's order in a given list
  readonly description: string;
  readonly status: AimStatus;
  readonly articleCount: number;
};

// Grant information types
export type OriginalGrantInfo = {
  readonly originalGrant: string;
  readonly proposalId?: string;
};

export type SupplementGrantInfo = {
  readonly grantTitle: string;
  readonly grantDescription?: string;
  readonly grantProposalId?: string;
  readonly grantStartDate?: string;
  readonly grantEndDate?: string;
  readonly aims?: ReadonlyArray<Aim>;
};

export type BaseProjectDetail = {
  readonly originalGrantProposalId?: string;
  readonly originalGrantAims?: ReadonlyArray<Aim>;
  readonly supplementGrant?: SupplementGrantInfo;
  readonly milestones?: ReadonlyArray<Milestone>;
};

type TeamCollaborators = {
  readonly collaborators?: ReadonlyArray<ProjectMember>;
};

export type DiscoveryProjectDetail = DiscoveryProject &
  BaseProjectDetail &
  TeamCollaborators & {
    readonly fundedTeam: FundedTeam;
  };

export type ResourceProjectDetail = ResourceProject &
  BaseProjectDetail &
  TeamCollaborators & {
    readonly fundedTeam?: FundedTeam;
  };

export type TraineeProjectDetail = TraineeProject & BaseProjectDetail;

export type ProjectDetail =
  | DiscoveryProjectDetail
  | ResourceProjectDetail
  | TraineeProjectDetail;

// Data Provider types
export type ProjectDataObject = Project;
export type DiscoveryProjectDataObject = DiscoveryProject;
export type ResourceProjectDataObject = ResourceProject;
export type TraineeProjectDataObject = TraineeProject;

export type ProjectDetailDataObject = ProjectDetail;

export type ListProjectDataObject = ListResponse<ProjectDataObject>;

export const projectLeadTeamRoles = [
  'Project Manager',
  'Lead PI (Core Leadership)',
  'Co-PI (Core Leadership)',
  'Data Manager',
] as const;

export const projectLeadMemberRoles = [
  'Project Manager',
  'Lead PI',
  'Co-PI',
  'Data Manager',
] as const;

export const traineeProjectLeadRoles = ['Trainee Project - Lead'] as const;

/**
 *
 * Determines if a user is a "lead" for a given project, controlling access
 * to features like editing milestone articles.
 *
 * For team-based projects (Discovery, team-based Resource): checks the user's
 * team role against projectLeadTeamRoles.
 *
 * For Trainee projects: checks if the user has the "Trainee Project - Lead"
 * role in the project's members list.
 *
 * For user-based Resource projects (isTeamBased=false, no teamId): these have
 * a members array with roles like "Project Manager" or "Lead PI (Core
 * Leadership)". We check the user's role in project.members against
 * projectLeadTeamRoles. For example, a Resource Project not linked to a team
 * but with individual user members who hold PM or Lead PI roles.
 */
export const isProjectLead = (
  userId: string,
  userTeams: ReadonlyArray<{ id: string; role: TeamRole }>,
  project: Project,
): boolean => {
  // Team-based projects: Discovery always has teamId, Resource may have teamId
  if ('teamId' in project && project.teamId) {
    const userTeam = userTeams.find((t) => t.id === project.teamId);
    return (
      !!userTeam &&
      (projectLeadTeamRoles as readonly string[]).includes(userTeam.role)
    );
  }

  if (project.projectType === 'Trainee Project') {
    return project.members.some(
      (m) =>
        m.id === userId &&
        (traineeProjectLeadRoles as readonly string[]).includes(m.role ?? ''),
    );
  }

  // User-based Resource projects (no teamId, has members): check members
  // for project-level lead roles.
  if (
    project.projectType === 'Resource Project' &&
    !project.teamId &&
    project.members
  ) {
    return project.members.some(
      (m) =>
        m.id === userId &&
        (projectLeadMemberRoles as readonly string[]).includes(m.role ?? ''),
    );
  }

  return false;
};

// Filter types
export type FetchProjectsFilter =
  | {
      readonly projectType?: ProjectType | ProjectType[];
      readonly status?: ProjectStatus | ProjectStatus[];
      readonly tags?: string[];
      readonly search?: string;
      readonly projectMembershipId?: never;
    }
  | {
      readonly projectMembershipId?: string;
      readonly projectType?: never;
      readonly status?: never;
      readonly tags?: never;
      readonly search?: never;
    };

// Grant type
export type GrantType = 'original' | 'supplement';

// Lead roles allowed to create milestones (project membership roles)
export const milestoneLeadRoles = [
  'Project Manager',
  'Lead PI',
  'Co-PI',
  'Data Manager',
  'Trainee Project - Lead',
] as const;
export type MilestoneLeadRole = (typeof milestoneLeadRoles)[number];

// Team roles that map to milestone lead access for Discovery projects
// Discovery projects use team membership instead of project membership
export const milestoneDiscoveryTeamRoles = [
  'Lead PI (Core Leadership)',
  'Co-PI (Core Leadership)',
  'Project Manager',
  'Data Manager',
] as const;

// Milestone creation
export type MilestoneCreateRequest = {
  readonly grantType: GrantType;
  readonly description: string;
  readonly status: MilestoneStatus;
  readonly aimIds: string[];
  readonly relatedArticleIds?: string[];
};

// Response types
export type ProjectResponse = Project;
export type ListProjectResponse = ListProjectDataObject;
