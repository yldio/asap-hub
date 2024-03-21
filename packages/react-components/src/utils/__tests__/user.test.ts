import { formatUserLocation, formatUserSocial } from '../user';

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

describe('formatUserSocial', () => {
  it.each`
    social                            | type               | result
    ${'https://twitter.com/username'} | ${'twitter'}       | ${'username'}
    ${'https://github.com/username'}  | ${'linkedIn'}      | ${'https://github.com/username'}
    ${''}                             | ${'googleScholar'} | ${''}
  `(
    'generates the correct result for "$type" type',
    ({ social, type, result }) => {
      expect(formatUserSocial(social, type)).toEqual(result);
    },
  );
});
