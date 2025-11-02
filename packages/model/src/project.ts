export type ProjectStatus = 'Active' | 'Complete' | 'Closed';

export type ProjectType = 'Discovery' | 'Resource' | 'Trainee';

export type BaseProject = {
  readonly id: string;
  readonly title: string;
  readonly status: ProjectStatus;
  readonly startDate: string;
  readonly endDate: string;
  readonly duration: string;
  readonly tags: string[];
};

export type ProjectMember = {
  readonly id: string;
  readonly displayName: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatarUrl?: string;
  readonly email?: string;
  readonly alumniSinceDate?: string;
  readonly href: string;
};

export type DiscoveryProject = BaseProject & {
  readonly projectType: 'Discovery';
  readonly researchTheme: string;
  readonly teamName: string;
  readonly teamId?: string;
  readonly inactiveSinceDate?: string;
};

export type ResourceProject = BaseProject & {
  readonly projectType: 'Resource';
  readonly resourceType: string;
  readonly isTeamBased: boolean;
  readonly teamName?: string;
  readonly teamId?: string;
  readonly members?: ReadonlyArray<ProjectMember>;
  readonly googleDriveLink?: string;
};

export type TraineeProject = BaseProject & {
  readonly projectType: 'Trainee';
  readonly trainer: ProjectMember;
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

