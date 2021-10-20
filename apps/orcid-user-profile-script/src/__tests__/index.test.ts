import { Auth0User } from '@asap-hub/auth';
import { sign } from 'jsonwebtoken';

import fetchOrcidUserProfile, { OrcidIdToken } from '..';

it('calls back with the user profile object', () => {
  const idToken: OrcidIdToken = {
    at_hash: 'bYFHnZ57n5UC3B_2g-japw',
    aud: 'APP-FVLMMB97OAE206YK',
    sub: '0000-0002-7164-1580',
    auth_time: 1589296534,
    iss: 'https://sandbox.orcid.org',
    exp: 2220682217,
    given_name: 'Tim',
    iat: 1589543698,
    family_name: 'Seckinger',
    jti: '2589ee66-86a7-4183-9aad-a7593eba2c01',
  };
  const cb: jest.MockedFunction<Parameters<typeof fetchOrcidUserProfile>[2]> =
    jest.fn();

  fetchOrcidUserProfile(
    {},
    { id_token: sign(idToken, '', { algorithm: 'none' }) },
    cb,
  );
  expect(cb).toHaveBeenCalled();
  const [err, profile] = cb.mock.calls[0]!;
  expect(err).toBeFalsy();
  expect(profile).toStrictEqual({
    user_id: '0000-0002-7164-1580',
    aud: 'APP-FVLMMB97OAE206YK',
    sub: '0000-0002-7164-1580',
    given_name: 'Tim',
    family_name: 'Seckinger',
    name: 'Tim Seckinger',
    orcid: '0000-0002-7164-1580',
  } as Auth0User);
});
