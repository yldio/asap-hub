import { UserCreateDataObject } from './types';
import Chance from 'chance';

const chance = Chance();

export const getUserFixture = (
  props: Partial<UserCreateDataObject> = {},
): UserCreateDataObject => {
  return {
    firstName: chance.first(),
    lastName: chance.last(),
    email: chance.email(),
    role: 'Guest',
    onboarded: true,
    teams: [],
    connections: [{ code: chance.guid() }],
    lastUpdated: '2021-01-01T00:00:00.000Z',
    ...props,
  };
};
