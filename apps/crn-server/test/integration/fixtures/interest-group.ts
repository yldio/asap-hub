import { InterestGroupCreateDataObject } from './types';
import Chance from 'chance';

const chance = Chance();

export const getInterestGroupFixture = (
  props: Partial<InterestGroupCreateDataObject> = {},
): InterestGroupCreateDataObject => {
  return {
    name: chance.word(),
    active: true,
    description: chance.sentence(),
    teams: [],
    leaders: [],
    calendar: null,
    tags: [],
    ...props,
  };
};
