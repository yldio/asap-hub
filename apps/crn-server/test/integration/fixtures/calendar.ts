import { CalendarCreateDataObject } from './types';
import Chance from 'chance';

const chance = Chance();

export const getCalendarFixture = (
  props: Partial<CalendarCreateDataObject> = {},
): CalendarCreateDataObject => {
  return {
    color: '#2952A3',
    name: chance.string(),
    syncToken: chance.string(),
    expirationDate: chance.integer(),
    resourceId: chance.string(),
    googleCalendarId: chance.email(),
    ...props,
  };
};
