import { TeamCreateDataObject } from './types';
import Chance from 'chance';

const chance = Chance();

export const getTeamFixture = (
  props: Partial<TeamCreateDataObject> = {},
): TeamCreateDataObject => {
  return {
    displayName: chance.animal(),
    applicationNumber: chance.guid(),
    researchTags: [],
    projectTitle: 'Project title',
    ...props,
  };
};
