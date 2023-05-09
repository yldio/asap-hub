import { gp2 as gp2Model, UserMetadataResponse } from '@asap-hub/model';
import { Auth0PostLoginApi } from '@vedicium/auth0-actions-sdk';
import nock from 'nock';

import { onExecutePostLogin } from '../post-login-add-metadata';
import type {
  Auth0PostLoginEventWithSecrets,
  DeepPartial,
  User,
} from '../types';

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

const apiUrl = 'http://api.example.com';

const eventBase = {
  request: {
    query: {
      redirect_uri: 'http://example.com',
    },
    body: {},
  },
  user,
  secrets: {
    API_URL: apiUrl,
    AUTH0_SHARED_SECRET: '',
    BASE_PR_APP_DOMAIN: '',
    AUTH0_ADDITIONAL_CLAIM_DOMAIN: '',
  },
} as DeepPartial<Auth0PostLoginEventWithSecrets> as Auth0PostLoginEventWithSecrets;

const apiBase = {
  access: {
    deny: jest.fn(),
  },
  idToken: {
    setCustomClaim: jest.fn(),
  },
} as Partial<Auth0PostLoginApi> as Auth0PostLoginApi;
beforeEach(() => {
  jest.clearAllMocks();
  nock.cleanAll();
});

it('denies login if the redirect_uri is missing from query and body', async () => {
  await onExecutePostLogin(
    {
      ...eventBase,
      request: {
        ...eventBase.request,
        query: {},
        body: {},
      },
    },
    apiBase,
  );
  expect(apiBase.access.deny).toHaveBeenCalledWith('Missing redirect_uri');
});

it('uses API_URL when the query redirect uri is not a PR URL', async () => {
  const exampleApiUrl = 'http://api2.example.com';
  nock(exampleApiUrl).get(`/webhook/users/${user.user_id}`).reply(200);
  await onExecutePostLogin(
    {
      ...eventBase,
      request: {
        ...eventBase.request,
        query: {
          redirect_uri: 'NOTPR',
        },
        body: {},
      },
      secrets: {
        ...eventBase.secrets,
        API_URL: exampleApiUrl,
      },
    },
    apiBase,
  );
  expect(nock.isDone()).toBe(true);
});

it('constructs PR backend API from query redirect_uri', async () => {
  nock('https://api-123.hub.example.com')
    .get(`/webhook/users/${user.user_id}`)
    .reply(200);
  await onExecutePostLogin(
    {
      ...eventBase,
      request: {
        ...eventBase.request,
        body: {},
        query: {
          redirect_uri: 'https://123.hub.example.com',
        },
      },
      secrets: {
        ...eventBase.secrets,
        BASE_PR_APP_DOMAIN: 'hub.example.com',
      },
    },
    apiBase,
  );
  expect(nock.isDone()).toBe(true);
});

it('constructs PR backend API from body redirect_uri', async () => {
  nock('https://api-123.hub.example.com')
    .get(`/webhook/users/${user.user_id}`)
    .reply(200);
  await onExecutePostLogin(
    {
      ...eventBase,
      request: {
        ...eventBase.request,
        query: {},
        body: {
          redirect_uri: 'https://123.hub.example.com',
        },
      },
      secrets: {
        ...eventBase.secrets,
        BASE_PR_APP_DOMAIN: 'hub.example.com',
      },
    },
    apiBase,
  );
  expect(nock.isDone()).toBe(true);
});

it('denies login if the backend throws an error', async () => {
  nock(apiUrl).get(`/webhook/users/${user.user_id}`).reply(404);

  await onExecutePostLogin(eventBase, apiBase);
  expect(apiBase.access.deny).toHaveBeenCalledWith(
    'Response code 404 (Not Found)',
  );
});

it('passes the AUTH0_SHARED_SECRET as a bearer token', async () => {
  const token = 'SECRET_KEY';
  nock(apiUrl, {
    reqheaders: {
      authorization: `Basic ${token}`,
    },
  })
    .get(`/webhook/users/${user.user_id}`)
    .reply(200);

  await onExecutePostLogin(
    {
      ...eventBase,
      secrets: {
        ...eventBase.secrets,
        AUTH0_SHARED_SECRET: token,
      },
    },
    apiBase,
  );
  expect(nock.isDone()).toBe(true);
});

describe('For a CRN login', () => {
  const baseUser: UserMetadataResponse = {
    onboarded: true,
    displayName: 'Joao Tiago',
    firstName: 'Joao',
    lastName: 'Tiago',
    email: 'joao.tiago@yld.io',
    id: 'myRandomId123',
    lastModifiedDate: '2020-08-21T14:23:31.924Z',
    createdDate: '2020-08-21T14:23:31.924Z',
    teams: [
      {
        id: 'team-1',
        displayName: 'Team 1',
        role: 'Lead PI (Core Leadership)',
      },
    ],
    expertiseAndResourceTags: [],
    questions: [],
    workingGroups: [],
    interestGroups: [],
    role: 'Grantee',
    algoliaApiKey: 'test-api-key',
  };
  it('adds the user metadata on successful fetch for crn', async () => {
    nock(apiUrl)
      .get(`/webhook/users/${user.user_id}`)
      .reply(200, { ...baseUser, id: '42' });

    await onExecutePostLogin(eventBase, apiBase);
    expect(apiBase.idToken.setCustomClaim).toHaveBeenCalledWith(
      'http://example.com/user',
      expect.objectContaining({ id: '42' }),
    );
  });

  it('rejects the login for alumni users', async () => {
    nock(apiUrl)
      .get(`/webhook/users/${user.user_id}`)
      .reply(200, { ...baseUser, alumniSinceDate: 'date' });

    await onExecutePostLogin(eventBase, apiBase);
    expect(apiBase.access.deny).toHaveBeenCalledWith(
      'alumni-user-access-denied',
    );
  });

  it('adds additional claim when AUTH0_ADDITIONAL_CLAIM_DOMAIN is set', async () => {
    nock(apiUrl)
      .get(`/webhook/users/${user.user_id}`)
      .reply(200, { ...baseUser, id: '42' });

    await onExecutePostLogin(
      {
        ...eventBase,
        secrets: {
          ...eventBase.secrets,
          AUTH0_ADDITIONAL_CLAIM_DOMAIN: 'https://v2.example.com',
        },
      },
      apiBase,
    );
    expect(apiBase.idToken.setCustomClaim).toHaveBeenCalledWith(
      'http://example.com/user',
      expect.objectContaining({ id: '42' }),
    );
    expect(apiBase.idToken.setCustomClaim).toHaveBeenCalledWith(
      'https://v2.example.com/user',
      expect.objectContaining({ id: '42' }),
    );
  });
});
describe('For a GP2 login', () => {
  const baseUser: gp2Model.UserResponse = {
    onboarded: true,
    displayName: 'Joao Tiago',
    firstName: 'Joao',
    lastName: 'Tiago',
    email: 'joao.tiago@yld.io',
    id: 'myRandomId123',
    createdDate: '2020-08-21T14:23:31.924Z',
    role: 'Trainee',
    region: 'Europe',
    country: 'Portugal',
    degrees: [],
    positions: [],
    projects: [],
    workingGroups: [],
    contributingCohorts: [],
    fundingStreams: undefined,
    keywords: [],
    questions: [],
  };
  it('adds the user metadata on successful fetch for crn', async () => {
    nock(apiUrl)
      .get(`/webhook/users/${user.user_id}`)
      .reply(200, { ...baseUser, id: '42' });

    await onExecutePostLogin(eventBase, apiBase);
    expect(apiBase.idToken.setCustomClaim).toHaveBeenCalledWith(
      'http://example.com/user',
      expect.objectContaining({ id: '42' }),
    );
  });
  it('adds additional claim when AUTH0_ADDITIONAL_CLAIM_DOMAIN is set', async () => {
    nock(apiUrl)
      .get(`/webhook/users/${user.user_id}`)
      .reply(200, { ...baseUser, id: '42' });

    await onExecutePostLogin(
      {
        ...eventBase,
        secrets: {
          ...eventBase.secrets,
          AUTH0_ADDITIONAL_CLAIM_DOMAIN: 'https://v2.example.com',
        },
      },
      apiBase,
    );
    expect(apiBase.idToken.setCustomClaim).toHaveBeenCalledWith(
      'http://example.com/user',
      expect.objectContaining({ id: '42' }),
    );
    expect(apiBase.idToken.setCustomClaim).toHaveBeenCalledWith(
      'https://v2.example.com/user',
      expect.objectContaining({ id: '42' }),
    );
  });
});
