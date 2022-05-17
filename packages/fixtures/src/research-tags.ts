import { ResearchTagResponse, ListResearchTagResponse } from '@asap-hub/model';

export const researchTagResponse: ResearchTagResponse = {
  id: '1234',
  name: 'Activity Assay',
  category: 'Method',
  types: ['Protein Data', 'Assay'],
  entities: ['Research Output'],
};

export const createResearchTagListResponse = (): ListResearchTagResponse => ({
  items: [researchTagResponse],
  total: 1,
});
