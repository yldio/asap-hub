import { ResearchOutputCreateDataObject } from './types';
import Chance from 'chance';

const chance = Chance();

export const getResearchOutputFixture = (
  props: Partial<ResearchOutputCreateDataObject> = {},
): ResearchOutputCreateDataObject => {
  return {
    title: chance.sentence(),
    documentType: 'Dataset',
    descriptionMD: chance.paragraph(),
    sharingStatus: 'Public',
    methods: [],
    organisms: [],
    environments: [],
    keywords: [],
    workingGroups: [],
    labs: [],
    authors: [],
    teams: [],
    published: true,
    link: `https://example.com/${chance.guid()}`,
    ...props,
  };
};
