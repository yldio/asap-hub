import { ListResponse } from '../common';

export const projectStatus = ['Active', 'Inactive', 'Completed'] as const;
export type ProjectStatus = typeof projectStatus[number];

export const isProjectStatus = (data: string | null): data is ProjectStatus =>
  projectStatus.includes(data as ProjectStatus);

export type ProjectMember = {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
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

export type ProjectDataObject = {
  description?: string;
  endDate?: string;
  id: string;
  keywords: ProjectKeywords[];
  leadEmail?: string;
  members: ProjectMember[];
  pmEmail?: string;
  projectProposalUrl?: string;
  startDate: string;
  status: ProjectStatus;
  title: string;
};

export type ListProjectDataObject = ListResponse<ProjectDataObject>;

export type ProjectResponse = ProjectDataObject;

export type ListProjectResponse = ListResponse<ProjectResponse>;
