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
  readonly href: string;
  readonly teams?: ReadonlyArray<ProjectMemberTeam>;
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

// Grant information types
export type GrantInfo = {
  readonly title: string;
  readonly description: string;
  readonly proposalURL?: string;
};

// Team detail for funded teams section
export type TeamDetail = {
  readonly id?: string;
  readonly name: string;
  readonly type: string;
  readonly researchTheme?: string;
  readonly description: string;
};

// Extended project detail types
export type DiscoveryProjectDetail = DiscoveryProject & {
  readonly description: string;
  readonly originalGrant: GrantInfo;
  readonly supplementGrant?: GrantInfo;
  readonly milestones?: ReadonlyArray<Milestone>;
  readonly fundedTeam: TeamDetail;
  readonly collaborators?: ReadonlyArray<ProjectMember>;
};

export type ResourceProjectDetail = ResourceProject & {
  readonly description: string;
  readonly originalGrant: GrantInfo;
  readonly supplementGrant?: GrantInfo;
  readonly milestones?: ReadonlyArray<Milestone>;
  readonly fundedTeam?: TeamDetail;
  readonly collaborators?: ReadonlyArray<ProjectMember>;
};

export type TraineeProjectDetail = TraineeProject & {
  readonly description: string;
  readonly originalGrant: GrantInfo;
  readonly supplementGrant?: GrantInfo;
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

export type ListProjectDataObject = {
  readonly total: number;
  readonly items: ProjectDataObject[];
};

// Filter types
export type FetchProjectsFilter = {
  readonly projectType?: ProjectType | ProjectType[];
  readonly status?: ProjectStatus | ProjectStatus[];
  readonly tags?: string[];
  readonly teamId?: string;
  readonly search?: string;
};

// Response types
export type ProjectResponse = Project;
export type ListProjectResponse = ListProjectDataObject;
