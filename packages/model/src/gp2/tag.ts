import { ListResponse } from '../common';

export type TagDataObject = {
  id: string;
  name: string;
};

export type ListTagsDataObject = ListResponse<TagDataObject>;

export type TagResponse = TagDataObject;
export type ListTagsResponse = ListResponse<TagResponse>;

export type TagCreateDataObject = Omit<TagDataObject, 'id'>;

export const tags = [
  'Administrative Support',
  'Advanced Parkinson’s therapies',
  'Biostatistics',
  'BLAAC-PD',
  'Botulinum toxin therapies',
  'Clinical',
  'Clinical Neuroscience',
  'Clinical Operations',
  'Cohort',
  'Communications',
  'Course Management',
  'Data Science',
  'Database and clinical information management',
  'Dementia',
  'Diversity',
  'Dystonia',
  'Education',
  'Epidemiology',
  'GBA1',
  'GCH-1',
  'Genetics',
  'Genetics of Parkinson’s',
  'Genetics of Progressive supranuclear palsy',
  'Genomics',
  'Grants administration',
  'GWAS',
  'Information Technology',
  'Laboratory Science',
  'LatinX',
  'Machine Learning',
  'Molecular Biology',
  'Movement Disorders',
  'Neurodegeneration',
  'Neurogenetics',
  'Neurology',
  'Parkinson-plus syndromes',
  'Patient Engagement',
  'Pharmacogenomics',
  'Progressive supranuclear palsy (PSP)',
  'Project Management',
  'Program Management',
  'PRS',
  'Rare Genetic Disorders',
  'Research Communications',
  'Trainee',
  'Training Opportunities',
];

export default tags;
