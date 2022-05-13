import { addHours, parseISO } from 'date-fns';
import { considerEndedAfter } from '../index';

describe('considerEndedAfter', () => {
  const dateNow = new Date();

  it('Adds one hour to the current time', () => {
    expect(considerEndedAfter(dateNow.toISOString())).toEqual(
      addHours(parseISO(dateNow.toISOString()), 1),
    );
  });

  it('Does not add any other ammount', () => {
    expect(considerEndedAfter(dateNow.toISOString())).not.toEqual(
      addHours(parseISO(dateNow.toISOString()), 2),
    );
  });
});
