export const resourceTypes = ['Link', 'Note'] as const;
type ResourceTypes = typeof resourceTypes[number];

interface ResourceBase {
  title: string;
  description?: string;
  type: ResourceTypes;
}
export interface ResourceLink extends ResourceBase {
  type: 'Link';
  externalLink: string;
}
export interface ResourceNote extends ResourceBase {
  type: 'Note';
}
export type Resource = ResourceNote | ResourceLink;

export const keywords = [
  'Epidemiology',
  'Neurology',
  'Genetics',
  'Genomics',
  'Data Science',
  'GP2 PhD',
  'Neurodegeneration',
  'Pharmacogenomics',
  'Movement Disorders',
  'Communications',
  'Patient Advocate',
  'Machine Learning',
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

export type Keywords = typeof keywords[number];
export const isKeyword = (data: string | null): data is Keywords =>
  keywords.includes(data as Keywords);
