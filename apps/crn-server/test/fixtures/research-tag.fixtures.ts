import {
  ListResearchTagDataObject,
  ListResearchTagResponse,
  ResearchTagDataObject,
  ResearchTagResponse,
} from '@asap-hub/model';

export const getResearchTagDataObject = (): ResearchTagDataObject => ({
  id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  name: 'Activity Assay',
  category: 'Method',
  types: ['Protein Data', 'Assay'],
});

export const getResearchTagResponse = (): ResearchTagResponse =>
  getResearchTagDataObject();

export const getListResearchTagDataObject = (): ListResearchTagDataObject => ({
  total: 1,
  items: [getResearchTagResponse()],
});

export const getFullListResearchTagDataObject =
  (): ListResearchTagDataObject => ({
    total: 5,
    items: [
      {
        id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
        name: 'Activity Assay',
        category: 'Method',
        types: ['Protein Data', 'Assay'],
      },
      {
        id: 'd77a7607-7b9a-4ef1-99ee-c389b33ea95b',
        name: 'Rat',
        category: 'Organism',
        types: ['Electrophysiology', 'Microscopy'],
      },
      {
        id: '8a936e45-6d5e-42a6-8acd-b849ab10f3f8',
        name: 'In Vitro',
        category: 'Environment',
        types: ['Proposal', 'Report'],
      },
      {
        id: 'dd0da578-5573-4758-b1db-43a078f5076e',
        name: 'Metabolite',
        category: 'Subtype',
        types: ['Microscopy', 'Report'],
      },
      {
        id: '0368cc55-b2cb-484f-8f25-c1e37975ff32',
        name: 'Keyword1',
        category: 'Keyword',
        types: [],
      },
    ],
  });

export const getListResearchTagResponse = (): ListResearchTagResponse =>
  getListResearchTagDataObject();

export const getContentfulGraphqlResearchTagResponse = () => ({
  total: 5,
  items: [
    {
      sys: {
        id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
      },
      name: 'Activity Assay',
      category: 'Method',
      types: ['Protein Data', 'Assay'],
    },
    {
      sys: {
        id: 'd77a7607-7b9a-4ef1-99ee-c389b33ea95b',
      },
      name: 'Rat',
      category: 'Organism',
      types: ['Electrophysiology', 'Microscopy'],
    },
    {
      sys: {
        id: '8a936e45-6d5e-42a6-8acd-b849ab10f3f8',
      },
      name: 'In Vitro',
      category: 'Environment',
      types: ['Proposal', 'Report'],
    },
    {
      sys: {
        id: 'dd0da578-5573-4758-b1db-43a078f5076e',
      },
      name: 'Metabolite',
      category: 'Subtype',
      types: ['Microscopy', 'Report'],
    },
    {
      sys: {
        id: '0368cc55-b2cb-484f-8f25-c1e37975ff32',
      },
      name: 'Keyword1',
      category: 'Keyword',
      types: [],
    },
  ],
});
