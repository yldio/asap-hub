import nock from 'nock';
import { UserResponse } from '@asap-hub/model';
import type { User, RuleContext } from '../types';
import addUserMetadata from '../add-user-metadata';

declare global {
  namespace NodeJS {
    interface Global {
      configuration: {
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
  request: { query: { redirect_uri: 'https://hub.asap.science/' }, body: {} },
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

const apiUser: UserResponse = {
  displayName: 'Joao Tiago',
  firstName: 'Joao',
  lastName: 'Tiago',
  email: 'joao.tiago@yld.io',
  id: 'myRandomId123',
  lastModifiedDate: '2020-08-21T14:23:31.924Z',
  createdDate: '2020-08-21T14:23:31.924Z',
  teams: [
    { id: 'team-1', displayName: 'Team 1', role: 'Lead PI (Core Leadership)' },
  ],
  skills: [],
  questions: [],
  role: 'Grantee',
};

describe('Auth0 Rule - Add User Metadata', () => {
  const apiURL = 'https://api.hub.asap.science';
  const apiSharedSecret = 'auth0_shared_secret';

  beforeEach(() => {
    global.configuration = {
      APP_ORIGIN: apiURL,
      API_SHARED_SECRET: apiSharedSecret,
    };
    nock.cleanAll();
  });

  it('errors if the redirect_uri is missing', async () => {
    const cb: jest.MockedFunction<Parameters<typeof addUserMetadata>[2]> =
      jest.fn();

    await addUserMetadata(
      user,
      { ...context, request: { query: {}, body: {} } },
      cb,
    );

    expect(cb).toHaveBeenCalledWith(expect.any(Error));
    const [err] = cb.mock.calls[0];
    expect(String(err)).toMatch(/redirect/i);
  });

  it('errors if it fails to fetch the user', async () => {
    nock(apiURL, {
      reqheaders: {
        authorization: `Basic ${apiSharedSecret}`,
      },
    })
      .get(`/webhook/users/${user.user_id}`)
      .reply(404);

    const cb: jest.MockedFunction<Parameters<typeof addUserMetadata>[2]> =
      jest.fn();

    await addUserMetadata(user, context, cb);

    expect(cb).toHaveBeenCalled();
    const [err, resUser, resContext] = cb.mock.calls[0];
    expect(String(err)).toMatch(/(^|\D)404(\D|$)/i);
    expect(resUser).toBeUndefined();
    expect(resContext).toBeUndefined();
  });

  it('adds the user metadata on successful fetch', async () => {
    nock(apiURL, {
      reqheaders: {
        authorization: `Basic ${apiSharedSecret}`,
      },
    })
      .get(`/webhook/users/${user.user_id}`)
      .reply(200, apiUser);

    const cb: jest.MockedFunction<Parameters<typeof addUserMetadata>[2]> =
      jest.fn();

    await addUserMetadata(user, context, cb);

    expect(cb).toHaveBeenCalled();
    const [err, resUser, resContext] = cb.mock.calls[0];
    expect(err).toBeFalsy();
    expect(resUser).not.toBeNull();
    expect(resContext).not.toBeNull();
    expect(resContext.idToken['https://hub.asap.science/user']).toStrictEqual({
      displayName: 'Joao Tiago',
      email: 'joao.tiago@yld.io',
      id: 'myRandomId123',
      firstName: 'Joao',
      lastName: 'Tiago',
      avatarUrl: undefined,
      teams: [
        {
          id: 'team-1',
          displayName: 'Team 1',
          role: 'Lead PI (Core Leadership)',
        },
      ],
    });
  });

  it('adds the user metadata on successful fetch when fetch uri provided in request body', async () => {
    nock(apiURL, {
      reqheaders: {
        authorization: `Basic ${apiSharedSecret}`,
      },
    })
      .get(`/webhook/users/${user.user_id}`)
      .reply(200, apiUser);

    const cb: jest.MockedFunction<Parameters<typeof addUserMetadata>[2]> =
      jest.fn();

    await addUserMetadata(
      user,
      {
        ...context,
        request: {
          query: {},
          body: { redirect_uri: 'https://hub.asap.science/' },
        },
      },
      cb,
    );

    expect(cb).toHaveBeenCalled();
    const [err, resUser, resContext] = cb.mock.calls[0];
    expect(err).toBeFalsy();
    expect(resUser).not.toBeNull();
    expect(resContext).not.toBeNull();
    expect(resContext.idToken['https://hub.asap.science/user']).toStrictEqual({
      displayName: 'Joao Tiago',
      email: 'joao.tiago@yld.io',
      id: 'myRandomId123',
      firstName: 'Joao',
      lastName: 'Tiago',
      avatarUrl: undefined,
      teams: [
        {
          id: 'team-1',
          displayName: 'Team 1',
          role: 'Lead PI (Core Leadership)',
        },
      ],
    });
  });
});
