import { ListResponse } from '../common';
import { Keywords, Resource } from './common';

const projectStatus = ['Active', 'Inactive', 'Completed'] as const;
export type ProjectStatus = typeof projectStatus[number];

export const projectMilestoneStatus = [
  'Active',
  'Not Started',
  'Completed',
] as const;
export type ProjectMilestoneStatus = typeof projectMilestoneStatus[number];

export const projectMemberRole = [
  'Contributor',
  'Investigator',
  'Project co-lead',
  'Project lead',
  'Project manager',
] as const;
export type ProjectMemberRole = typeof projectMemberRole[number];

export type ProjectMember = {
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  role: ProjectMemberRole;
  userId: string;
};

export type ProjectMilestone = {
  description?: string;
  link?: string;
  status: ProjectMilestoneStatus;
  title: string;
};

export type ProjectDataObject = {
  description?: string;
  endDate?: string;
  id: string;
  keywords: Keywords[];
  leadEmail?: string;
  members: ProjectMember[];
  milestones: ProjectMilestone[];
  pmEmail?: string;
  projectProposalUrl?: string;
  startDate: string;
  status: ProjectStatus;
  title: string;
  resources?: Resource[];
};

export type ListProjectDataObject = ListResponse<ProjectDataObject>;

export type ProjectResponse = ProjectDataObject;

export type ListProjectResponse = ListResponse<ProjectResponse>;
export type ProjectUpdateDataObject = Required<
  Pick<ProjectDataObject, 'resources'>
>;

export type ProjectUpdateRequest = ProjectUpdateDataObject;

export type ProjectResourcesPutRequest = NonNullable<
  ProjectDataObject['resources']
>;
