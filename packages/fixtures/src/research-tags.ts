import { ListResearchTagResponse, ResearchTagResponse } from '@asap-hub/model';

export const researchTagMethodResponse: ResearchTagResponse = {
  id: '1234',
  name: 'ELISA',
  category: 'Method',
  types: ['Protein Data', 'Assay', 'Spectroscopy'],
};

export const researchTagOrganismResponse: ResearchTagResponse = {
  id: 'd77a7607-7b9a-4ef1-99ee-c389b33ea95b',
  name: 'Rat',
  category: 'Organism',
  types: ['Electrophysiology', 'Microscopy & Imaging', 'Model System'],
};

export const researchTagEnvironmentResponse: ResearchTagResponse = {
  id: '8a936e45-6d5e-42a6-8acd-b849ab10f3f8',
  name: 'In Vitro',
  category: 'Environment',
  types: ['Proposal', 'Report', 'Model System', 'Microscopy & Imaging'],
};

export const researchTagSubtypeResponse: ResearchTagResponse = {
  id: 'dd0da578-5573-4758-b1db-43a078f5076e',
  name: 'Metabolite',
  category: 'Subtype',
  types: ['Microscopy & Imaging', 'Report', 'Model System'],
};

export const researchTagKeywordResponse: ResearchTagResponse = {
  id: '0368cc55-b2cb-484f-8f25-c1e37975ff32',
  name: 'Keyword1',
  category: 'Keyword',
  types: [],
};

export const researchTagsResponse: ResearchTagResponse[] = [
  researchTagMethodResponse,
  researchTagOrganismResponse,
  researchTagEnvironmentResponse,
  researchTagSubtypeResponse,
  researchTagKeywordResponse,
];

export const createResearchTagListResponse = (): ListResearchTagResponse => ({
  items: researchTagsResponse,
  total: 5,
});
