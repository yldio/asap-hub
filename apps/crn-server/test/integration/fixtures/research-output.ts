import Chance from 'chance';
import { sampleSize } from 'lodash';
import { ResearchTagDataObject } from '@asap-hub/model';
import { ResearchOutputCreateDataObject } from './types';

const chance = Chance();

export const getResearchOutputFixture = (
  props: Partial<ResearchOutputCreateDataObject> = {},
  options: { researchTags?: ResearchTagDataObject[] } = {},
): ResearchOutputCreateDataObject => {
  const { researchTags = [] } = options;
  const getTags = (
    category: 'Method' | 'Organism' | 'Environment' | 'Keyword',
  ) => {
    return sampleSize(
      researchTags
        .filter((tag: ResearchTagDataObject) => tag.category === category)
        .map((tag: ResearchTagDataObject) => tag.name),
      2,
    );
  };
  return {
    title: chance.sentence(),
    documentType: 'Dataset',
    descriptionMD: chance.paragraph(),
    sharingStatus: 'Public',
    methods: getTags('Method'),
    organisms: getTags('Organism'),
    environments: getTags('Environment'),
    keywords: getTags('Keyword'),
    workingGroups: [],
    labs: [],
    authors: [],
    teams: [],
    relatedEvents: [],
    relatedResearch: [],
    published: true,
    link: `https://example.com/${chance.guid()}`,
    ...props,
  };
};
