import nock from 'nock';
import connectUser from '../connect-user';
import * as handleError from '../handle-error';
import type { RuleContext, User } from '../types';

declare global {
  namespace NodeJS {
    interface Global {
      configuration: {
        APP_DOMAIN: string;
        APP_ORIGIN: string;
        API_SHARED_SECRET: string;
      };
    }
  }
}

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
  request: {
    query: {},
    body: {},
  },
  sso: {
    with_auth0: false,
    with_dbconn: false,
    current_clients: ['Av2psgVspAN00Kez9v1vR2c496a9zCW3'],
  },
  accessToken: {},
  idToken: {
    created_at: '2020',
    user_id: '42',
    updated_at: '2020',
    picture: 'google.com/x.jpg',
    nickname: 'Nick',
    name: 'Name',
    locale: 'en',
    identities: [],
    given_name: 'Given',
    family_name: 'Family',
    email: 'me@example.com',
    email_verified: true,
  },
  sessionID: 'gTOtfayMuGzFRmyOllSKHuH7Ci1',
  authorization: { roles: [] },
};

describe('Auth0 Rule - Connect User', () => {
  const apiURL = 'https://api.hub.asap.science';
  const appDomain = 'hub.asap.science';
  const apiSharedSecret = 'auth0_shared_secret';
  const invitation_code = 'sampleInvitationCode';

  beforeEach(() => {
    global.configuration = {
      APP_DOMAIN: appDomain,
      APP_ORIGIN: apiURL,
      API_SHARED_SECRET: apiSharedSecret,
    };
    nock.cleanAll();
  });

  it('should callback with same user + context if receives no invitation_code', () => {
    const cb: jest.MockedFunction<Parameters<typeof connectUser>[2]> =
      jest.fn();

    connectUser(user, context, cb);
    expect(cb).toHaveBeenCalled();
    const [err, resUser, resContext] = cb.mock.calls[0];
    expect(err).toBeFalsy();
    expect(resUser).not.toBeNull();
    expect(resContext).not.toBeNull();
  });

  it('should return an error if fails to connect the user', async () => {
    const spy = jest.spyOn(handleError, 'handleError');
    nock(apiURL, {
      reqheaders: {
        authorization: `Basic ${apiSharedSecret}`,
      },
    })
      .post('/webhook/users/connections', {
        code: invitation_code,
        userId: user.user_id,
      })
      .reply(404);

    const cb: jest.MockedFunction<Parameters<typeof connectUser>[2]> =
      jest.fn();

    await connectUser(
      user,
      { ...context, request: { query: { invitation_code }, body: {} } },
      cb,
    );

    expect(cb).toHaveBeenCalled();
    const [err, resUser, resContext] = cb.mock.calls[0];
    expect(err).not.toBeNull();
    expect(resUser).toBeUndefined();
    expect(resContext).toBeUndefined();
    expect(spy).toHaveBeenCalled();
  });

  it('should connect user if receives an invitation_code', async () => {
    nock(apiURL, {
      reqheaders: {
        authorization: `Basic ${apiSharedSecret}`,
      },
    })
      .post('/webhook/users/connections', {
        code: invitation_code,
        userId: user.user_id,
      })
      .reply(202);

    const cb: jest.MockedFunction<Parameters<typeof connectUser>[2]> =
      jest.fn();

    await connectUser(
      user,
      { ...context, request: { query: { invitation_code }, body: {} } },
      cb,
    );

    expect(cb).toHaveBeenCalled();
    const [err, resUser, resContext] = cb.mock.calls[0];
    expect(err).toBeFalsy();
    expect(resUser).not.toBeNull();
    expect(resContext).not.toBeNull();
  });
});
