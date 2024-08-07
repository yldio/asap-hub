import { FetchOptions, ListResponse } from '../common';
import { Calendar, Member, Milestone, Resource, UpdateMember } from './common';
import { TagDataObject } from './tag';

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
  tags: TagDataObject[];
  leadEmail?: string;
  members: ProjectMember[];
  milestones: Milestone[];
  pmEmail: string;
  projectProposalUrl?: string;
  startDate?: string;
  status: ProjectStatus;
  title: string;
  resources?: Resource[];
  traineeProject: boolean;
  opportunitiesAvailable: boolean;
  opportunitiesShortText?: string;
  opportunitiesLinkName?: string;
  opportunitiesLink?: string;
  calendar?: Calendar;
};

export type ListProjectDataObject = ListResponse<ProjectDataObject>;

export type ProjectResponse = ProjectDataObject;

export type ListProjectResponse = ListResponse<ProjectResponse>;
export type ProjectUpdateDataObject = Partial<
  Pick<ProjectDataObject, 'resources'>
> & {
  members?: UpdateMember<ProjectMemberRole>[];
  tags?: Omit<TagDataObject, 'name'>[];
};

export type ProjectUpdateRequest = ProjectUpdateDataObject;

export type ProjectResourcesPutRequest = NonNullable<
  ProjectDataObject['resources']
>;

export const opportunitiesAvailable = 'Opportunities Available';
export const traineeProject = 'Trainee Project';
export type ProjectFilterType =
  | typeof opportunitiesAvailable
  | typeof traineeProject;

export type FetchProjectFilter = {
  status?: ProjectStatus[];
  type?: ProjectFilterType[];
};

export type FetchProjectOptions = FetchOptions<FetchProjectFilter>;
export type FetchApiProjectOptions = FetchOptions<{
  userId?: string;
}>;
