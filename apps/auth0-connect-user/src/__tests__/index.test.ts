import nock from 'nock';
import type { User, RuleContext } from '@asap-hub/auth0-rule';
import connectUser from '..';

const user: User = {
  created_at: '2020-08-17T14:01:53.691Z',
  email: 'joao.tiago@yld.io',
  email_verified: true,
  family_name: 'Tiago',
  given_name: 'Joao',
  identities: [
    {
      provider: 'google-oauth2',
      access_token: 'accessToken',
      expires_in: 3599,
      user_id: 'userId',
      connection: 'google-oauth2',
      isSocial: true,
    },
  ],
  locale: 'en',
  name: 'Joao Tiago',
  nickname: 'joao.tiago',
  picture:
    'https://lh3.googleusercontent.com/a-/AOh14GhcUymAYADTOFTtS7zHdsWbfi2AbCIbpBtxAdNWug',
  updated_at: '2020-08-21T09:19:39.985Z',
  user_id: 'google-oauth2|JTsUserId',
};

const context: RuleContext = {
  tenant: 'asap-hub',
  clientID: 'Av2psgVspAN0c496a9zCW3',
  clientName: 'ASAP Hub',
  clientMetadata: {},
  connection: 'google-oauth2',
  connectionStrategy: 'google-oauth2',
  connectionID: 'con_O56WVRrXC9Z',
  connectionOptions: {},
  connectionMetadata: {},
  samlConfiguration: {},
  protocol: 'oidc-basic-profile',
  stats: { loginsCount: 14 },
  sso: {
    with_auth0: false,
    with_dbconn: false,
    current_clients: ['Av2psgVspAN00Kez9v1vR2c496a9zCW3'],
  },
  accessToken: {},
  idToken: {},
  sessionID: 'gTOtfayMuGzFRmyOllSKHuH7Ci1',
  authorization: { roles: [] },
};

it('should callback with same user + context if receives no invitationCode', () => {
  const cb: jest.MockedFunction<Parameters<typeof connectUser>[2]> = jest.fn();

  connectUser(user, context, cb);
  expect(cb).toHaveBeenCalled();
  const [err, resUser, resContext] = cb.mock.calls[0];
  expect(err).toBeFalsy();
  expect(resUser).not.toBeNull();
  expect(resContext).not.toBeNull();
});

it('should return an error if fails to connect the user', () => {
  const invitationCode = 'sampleInvitationCode';

  nock('https://hub.asap.science', {
    reqheaders: {
      authorization: 'Basic auth0_shared_secret',
    },
  })
    .post('/webhook/users/connections', {
      code: invitationCode,
      userId: user.user_id,
    })
    .reply(404);

  const cb: jest.MockedFunction<Parameters<typeof connectUser>[2]> = jest.fn();

  connectUser(user, { ...context, invitationCode }, cb);

  expect(cb).toHaveBeenCalled();
  const [err, resUser, resContext] = cb.mock.calls[0];
  expect(err).not.toBeNull();
  expect(resUser).toBeNull();
  expect(resContext).toBeNull();
});

it('should connect user if receives an invitationCode', () => {
  const invitationCode = 'sampleInvitationCode';

  nock('https://hub.asap.science', {
    reqheaders: {
      authorization: 'Basic auth0_shared_secret',
    },
  })
    .post('/webhook/users/connections', {
      code: invitationCode,
      userId: user.user_id,
    })
    .reply(202);

  const cb: jest.MockedFunction<Parameters<typeof connectUser>[2]> = jest.fn();

  connectUser(user, { ...context, invitationCode }, cb);

  expect(cb).toHaveBeenCalled();
  const [err, resUser, resContext] = cb.mock.calls[0];
  expect(err).toBeFalsy();
  expect(resUser).not.toBeNull();
  expect(resContext).not.toBeNull();
});
