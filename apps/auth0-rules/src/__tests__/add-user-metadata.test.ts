import type { User as Auth0User } from '@asap-hub/auth';
import { gp2, UserMetadataResponse } from '@asap-hub/model';
import nock from 'nock';
import addUserMetadata from '../add-user-metadata';
import type { RuleContext, User } from '../types';

class UnauthorizedError {}
const unauthorizedErrorMock: jest.MockedClass<typeof UnauthorizedError> = jest
  .fn()
  .mockImplementation(() => new UnauthorizedError());

declare global {
  namespace NodeJS {
    interface Global {
      configuration: {
        APP_DOMAIN: string;
        APP_ORIGIN: string;
        API_SHARED_SECRET: string;
      };

      UnauthorizedError: typeof UnauthorizedError;
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

const apiUser: UserMetadataResponse = {
  onboarded: true,
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
  expertiseAndResourceTags: [],
  questions: [],
  role: 'Grantee',
  algoliaApiKey: 'test-api-key',
};

const gp2ApiUser: gp2.UserResponse = {
  displayName: 'Joao Tiago',
  firstName: 'Joao',
  lastName: 'Tiago',
  email: 'joao.tiago@yld.io',
  id: 'myRandomId123',
  createdDate: '2020-08-21T14:23:31.924Z',
  role: 'Trainee',
  region: 'Europe',
};

describe('Auth0 Rule - Add User Metadata', () => {
  const apiURL = 'https://api.hub.asap.science';
  const appDomain = 'hub.asap.science';
  const apiSharedSecret = 'auth0_shared_secret';

  const cb: jest.MockedFunction<Parameters<typeof addUserMetadata>[2]> =
    jest.fn();

  beforeEach(() => {
    global.configuration = {
      APP_DOMAIN: appDomain,
      APP_ORIGIN: apiURL,
      API_SHARED_SECRET: apiSharedSecret,
    };
    global.UnauthorizedError = unauthorizedErrorMock;
    nock.cleanAll();
  });

  afterEach(() => {
    cb.mockClear();
  });

  it('errors if the redirect_uri is missing', async () => {
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

    await addUserMetadata(user, context, cb);

    expect(cb).toHaveBeenCalledWith(expect.any(Error));
    const [err, resUser, resContext] = cb.mock.calls[0];
    expect(String(err)).toMatch(/(^|\D)404(\D|$)/i);
    expect(resUser).toBeUndefined();
    expect(resContext).toBeUndefined();
  });

  it('adds the user metadata on successful fetch for crn', async () => {
    nock(apiURL, {
      reqheaders: {
        authorization: `Basic ${apiSharedSecret}`,
      },
    })
      .get(`/webhook/users/${user.user_id}`)
      .reply(200, apiUser);

    await addUserMetadata(user, context, cb);

    expect(cb).toHaveBeenCalled();
    const [err, resUser, resContext] = cb.mock.calls[0];
    expect(err).toBeFalsy();
    expect(resUser).not.toBeNull();
    expect(resContext).not.toBeNull();
    const expectedUser: Auth0User = {
      displayName: 'Joao Tiago',
      email: 'joao.tiago@yld.io',
      id: 'myRandomId123',
      onboarded: true,
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
      algoliaApiKey: 'test-api-key',
    };
    expect(resContext.idToken['https://hub.asap.science/user']).toStrictEqual(
      expectedUser,
    );
  });

  it('adds the user metadata on successful fetch for gp2', async () => {
    nock(apiURL, {
      reqheaders: {
        authorization: `Basic ${apiSharedSecret}`,
      },
    })
      .get(`/webhook/users/${user.user_id}`)
      .reply(200, gp2ApiUser);

    await addUserMetadata(
      user,
      {
        ...context,
        request: {
          query: {},
          body: { redirect_uri: 'https://gp2.asap.science/' },
        },
      },
      cb,
    );

    expect(cb).toHaveBeenCalled();
    const [err, resUser, resContext] = cb.mock.calls[0];
    expect(err).toBeFalsy();
    expect(resUser).not.toBeNull();
    expect(resContext).not.toBeNull();
    const expectedUser: Auth0User = {
      displayName: 'Joao Tiago',
      email: 'joao.tiago@yld.io',
      id: 'myRandomId123',
      onboarded: true,
      firstName: 'Joao',
      lastName: 'Tiago',
      avatarUrl: undefined,
      algoliaApiKey: '',
      teams: [],
    };
    expect(resContext.idToken['https://gp2.asap.science/user']).toStrictEqual(
      expectedUser,
    );
  });

  it('adds the user metadata on successful fetch when fetch uri provided in request body', async () => {
    nock(apiURL, {
      reqheaders: {
        authorization: `Basic ${apiSharedSecret}`,
      },
    })
      .get(`/webhook/users/${user.user_id}`)
      .reply(200, apiUser);

    await addUserMetadata(
      user,
      {
        ...context,
        request: {
          query: {},
          body: { redirect_uri: 'https://other-uri.com/' },
        },
      },
      cb,
    );

    expect(cb).toHaveBeenCalled();
    const [err, resUser, resContext] = cb.mock.calls[0];
    expect(err).toBeFalsy();
    expect(resUser).not.toBeNull();
    expect(resContext).not.toBeNull();
    const expectedUser: Auth0User = {
      displayName: 'Joao Tiago',
      email: 'joao.tiago@yld.io',
      id: 'myRandomId123',
      onboarded: true,
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
      algoliaApiKey: 'test-api-key',
    };
    expect(resContext.idToken['https://other-uri.com/user']).toStrictEqual(
      expectedUser,
    );
  });

  describe('For a CRN user', () => {
    it('Should invoke the callback with an error when the user is an alumni', async () => {
      const alumniMetadata: UserMetadataResponse = {
        ...apiUser,
        alumniSinceDate: '2021-01-01',
      };

      nock(apiURL, {
        reqheaders: {
          authorization: `Basic ${apiSharedSecret}`,
        },
      })
        .get(`/webhook/users/${user.user_id}`)
        .reply(200, alumniMetadata);

      await addUserMetadata(user, context, cb);

      expect(cb).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(unauthorizedErrorMock).toHaveBeenCalledWith(
        'alumni-user-access-denied',
      );
    });
  });

  describe('When a PR redirect uri is given', () => {
    it('fetches user metadata from the PR API', async () => {
      const apiPRUrl = 'https://api-1234.hub.asap.science';
      nock(apiPRUrl, {
        reqheaders: {
          authorization: `Basic ${apiSharedSecret}`,
        },
      })
        .get(`/webhook/users/${user.user_id}`)
        .reply(200, apiUser);

      await addUserMetadata(
        user,
        {
          ...context,
          request: {
            query: {},
            body: { redirect_uri: 'https://1234.hub.asap.science/' },
          },
        },
        cb,
      );

      expect(cb).toHaveBeenCalled();
      const resContext = cb.mock.calls[0][2];
      const expectedUser: Auth0User = {
        displayName: 'Joao Tiago',
        email: 'joao.tiago@yld.io',
        id: 'myRandomId123',
        onboarded: true,
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
        algoliaApiKey: 'test-api-key',
      };
      expect(
        resContext.idToken['https://1234.hub.asap.science/user'],
      ).toStrictEqual(expectedUser);
    });

    it('fetches user metadata from the PR API url for a different domain', async () => {
      const appAlternativeDomain = 'gp2.asap.science';
      global.configuration.APP_DOMAIN = appAlternativeDomain;
      const apiPRUrl = `https://api-1234.${appAlternativeDomain}`;
      nock(apiPRUrl, {
        reqheaders: {
          authorization: `Basic ${apiSharedSecret}`,
        },
      })
        .get(`/webhook/users/${user.user_id}`)
        .reply(200, apiUser);

      await addUserMetadata(
        user,
        {
          ...context,
          request: {
            query: {},
            body: { redirect_uri: 'https://1234.gp2.asap.science/' },
          },
        },
        cb,
      );

      expect(cb).toHaveBeenCalled();
      const resContext = cb.mock.calls[0][2];
      const expectedUser: Auth0User = {
        displayName: 'Joao Tiago',
        email: 'joao.tiago@yld.io',
        id: 'myRandomId123',
        onboarded: true,
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
        algoliaApiKey: 'test-api-key',
      };
      expect(
        resContext.idToken['https://1234.gp2.asap.science/user'],
      ).toStrictEqual(expectedUser);
    });
  });

  describe('handle errors', () => {
    beforeEach(() => {
      nock(apiURL, {
        reqheaders: {
          authorization: `Basic ${apiSharedSecret}`,
        },
      })
        .get(`/webhook/users/${user.user_id}`)
        .reply(200, apiUser);
    });

    test('should handle Errors', async () => {
      const error = new Error('test');
      cb.mockImplementationOnce(() => {
        throw error;
      });

      await addUserMetadata(user, context, cb);

      expect(cb).toBeCalledWith(error);
    });

    test.each([
      'What?!',
      11,
      { what: 'is this' },
      null,
      new Promise(() => {}),
      undefined,
    ])('should handle non Errors, %s', async (literal) => {
      cb.mockImplementationOnce(() => {
        throw literal;
      });
      await addUserMetadata(user, context, cb);

      expect(cb).toBeCalledWith(expect.any(Error));
    });
  });
});
