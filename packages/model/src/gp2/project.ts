import { ListResponse } from '../common';

const projectStatus = ['Active', 'Inactive', 'Completed'] as const;
export type ProjectStatus = typeof projectStatus[number];

export const isProjectStatus = (data: string | null): data is ProjectStatus =>
  projectStatus.includes(data as ProjectStatus);

export type ProjectMember = {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

export type ProjectDataObject = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  projectProposal?: string;
  members: ProjectMember[];
};

export type ListProjectDataObject = ListResponse<ProjectDataObject>;

export type ProjectResponse = ProjectDataObject;

export type ListProjectResponse = ListResponse<ProjectResponse>;
