import { ListResponse } from '../common';

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

export const isProjectMemberRole = (
  data: string | null,
): data is ProjectMemberRole =>
  projectMemberRole.includes(data as ProjectMemberRole);

export type ProjectMember = {
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  role: ProjectMemberRole;
  userId: string;
};

export const projectKeywords = [
  'Movement Disorders',
  'Epidemiology',
  'Neurology',
  'Genetics',
  'Genomics',
  'Data Science',
  'GP2 PhD',
  'Neurodegeneration',
  'Neurogenetics',
  'Pharmacogenomics',
  'Movement Disorders',
  'Communications',
  'Patient Advocate',
  'Machine Learning',
  'Program Management',
  'Research Communications',
  'Patient Engagement',
  'R',
  'Bash',
  'Diversity',
  'Laboratory Science',
  'Operations',
  'Project Management',
  'Molecular Biology',
  'Research Grants',
  'Neurogenetics',
  'Python',
  'Biostatistics',
  'Stata',
  'Education',
  'Program Management',
  'Course Management',
  'Training',
  'Biobanking',
  'Career Development',
  'Administrative Support',
  'GP2 Opportunities',
  "GP2 Master's",
  'Computer Science',
  'Outreach',
  'Neuroimaging',
  'Parkinson disease',
] as const;

export type ProjectKeywords = typeof projectKeywords[number];
export const isProjectKeyword = (
  data: string | null,
): data is ProjectKeywords => projectKeywords.includes(data as ProjectKeywords);

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
  keywords: ProjectKeywords[];
  leadEmail?: string;
  members: ProjectMember[];
  milestones: ProjectMilestone[];
  pmEmail?: string;
  projectProposalUrl?: string;
  startDate: string;
  status: ProjectStatus;
  title: string;
};

export type ListProjectDataObject = ListResponse<ProjectDataObject>;

export type ProjectResponse = ProjectDataObject;

export type ListProjectResponse = ListResponse<ProjectResponse>;
