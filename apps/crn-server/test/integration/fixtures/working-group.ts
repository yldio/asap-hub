import { WorkingGroupCreateDataObject } from './types';
import Chance from 'chance';

const chance = Chance();

export const getWorkingGroupFixture = (
  props: Partial<WorkingGroupCreateDataObject> = {},
): WorkingGroupCreateDataObject => {
  return {
    title: chance.sentence(),
    complete: false,
    description: `<p>${chance.sentence()}</p>`,
    shortText: '',
    members: [],
    leaders: [],
    deliverables: [],
    tags: [],
    lastUpdated: '2021-01-01T00:00:00.000Z',
    ...props,
  };
};
