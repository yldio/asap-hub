import { ListResponse } from './common';
import { TeamDataObject } from './team';

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

export type BaseProject = {
  readonly id: string;
  readonly title: string;
  readonly status: ProjectStatus;
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
  | 'Incomplete'
  | 'Not Started';

export type Milestone = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: MilestoneStatus;
  readonly link?: string;
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
};

// Extended project detail types
export type DiscoveryProjectDetail = DiscoveryProject & {
  readonly originalGrantProposalId?: string;
  readonly supplementGrant?: SupplementGrantInfo;
  readonly milestones?: ReadonlyArray<Milestone>;
  readonly fundedTeam: FundedTeam;
  readonly collaborators?: ReadonlyArray<ProjectMember>;
};

export type ResourceProjectDetail = ResourceProject & {
  readonly originalGrantProposalId?: string;
  readonly supplementGrant?: SupplementGrantInfo;
  readonly milestones?: ReadonlyArray<Milestone>;
  readonly fundedTeam?: FundedTeam;
  readonly collaborators?: ReadonlyArray<ProjectMember>;
};

export type TraineeProjectDetail = TraineeProject & {
  readonly originalGrantProposalId?: string;
  readonly supplementGrant?: SupplementGrantInfo;
  readonly milestones?: ReadonlyArray<Milestone>;
};

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

// Response types
export type ProjectResponse = Project;
export type ListProjectResponse = ListProjectDataObject;
