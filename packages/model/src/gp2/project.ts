import { ListResponse } from '../common';
import { Calendar, Member, Milestone, Resource } from './common';

export const projectStatus = ['Active', 'Paused', 'Completed'] as const;
export type ProjectStatus = (typeof projectStatus)[number];

export const projectMemberRole = [
  'Contributor',
  'Investigator',
  'Project co-lead',
  'Project lead',
  'Project manager',
] as const;
export type ProjectMemberRole = (typeof projectMemberRole)[number];

export type ProjectMember = Member<ProjectMemberRole>;

export type ProjectDataObject = {
  description?: string;
  endDate?: string;
  id: string;
  keywords: string[];
  leadEmail?: string;
  members: ProjectMember[];
  milestones: Milestone[];
  pmEmail?: string;
  projectProposalUrl?: string;
  startDate: string;
  status: ProjectStatus;
  title: string;
  resources?: Resource[];
  traineeProject: boolean;
  opportunitiesLink?: string;
  calendar?: Calendar;
};

export type ListProjectDataObject = ListResponse<ProjectDataObject>;

export type ProjectResponse = ProjectDataObject;

export type ListProjectResponse = ListResponse<ProjectResponse>;
export type ProjectUpdateDataObject = Partial<
  Pick<ProjectDataObject, 'resources'>
> & {
  members?: Pick<ProjectMember, 'userId' | 'role'>[];
};

export type ProjectUpdateRequest = ProjectUpdateDataObject;

export type ProjectResourcesPutRequest = NonNullable<
  ProjectDataObject['resources']
>;
