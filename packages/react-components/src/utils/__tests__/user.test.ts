import { formatUserLocation } from '../user';

describe('formatUserLocation', () => {
  it.each`
    country      | stateOrProvince      | city         | text
    ${undefined} | ${undefined}         | ${undefined} | ${''}
    ${undefined} | ${undefined}         | ${'City'}    | ${'City'}
    ${undefined} | ${'StateOrProvince'} | ${undefined} | ${'StateOrProvince'}
    ${'Country'} | ${undefined}         | ${undefined} | ${'Country'}
    ${undefined} | ${'StateOrProvince'} | ${'City'}    | ${'City, StateOrProvince'}
    ${'Country'} | ${undefined}         | ${'City'}    | ${'City, Country'}
    ${'Country'} | ${'StateOrProvince'} | ${undefined} | ${'StateOrProvince, Country'}
    ${'Country'} | ${'StateOrProvince'} | ${'City'}    | ${'City, StateOrProvince, Country'}
  `(
    'generates the location description "$text"',
    ({ text, city, stateOrProvince, country }) => {
      expect(formatUserLocation(city, stateOrProvince, country)).toEqual(text);
    },
  );
});
