import { Auth0PostLoginApi } from '@vedicium/auth0-actions-sdk';
import nock from 'nock';
import { onExecutePostLogin } from '../post-login-connect-user';
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

const apiUrl = 'https://api.hub.asap.science';
const invitation_code = 'sampleInvitationCode';

const eventBase = {
  request: {
    query: {
      invitation_code,
    },
    body: {},
  },
  user,
  secrets: {
    ASAP_API_URL: apiUrl,
    AUTH0_SHARED_SECRET: '',
    PR_APP_DOMAIN: '',
    AUTH0_ADDITIONAL_CLAIM_DOMAIN: '',
  },
} as DeepPartial<Auth0PostLoginEventWithSecrets> as Auth0PostLoginEventWithSecrets;

const apiBase = {
  access: {
    deny: jest.fn(),
  },
} as Partial<Auth0PostLoginApi> as Auth0PostLoginApi;

beforeEach(() => {
  nock.cleanAll();
  jest.clearAllMocks();
});

it('should call the connections api with Auth0 UserId, invitation code and Shared Secret', async () => {
  nock(apiUrl, {
    reqheaders: {
      authorization: 'Basic SHARED_SECRET',
    },
  })
    .post('/webhook/users/connections', {
      code: 'example invitation code',
      userId: 'auth0|abc123',
    })
    .reply(200);

  await onExecutePostLogin(
    {
      ...eventBase,
      secrets: {
        ...eventBase.secrets,
        AUTH0_SHARED_SECRET: 'SHARED_SECRET',
      },
      request: {
        ...eventBase.request,

        query: {
          ...eventBase.request.query,
          invitation_code: 'example invitation code',
        },
      },
      user: { ...user, user_id: 'auth0|abc123' },
    },
    apiBase,
  );
  expect(nock.isDone()).toBe(true);
  expect(apiBase.access.deny).not.toBeCalled();
});

it('should not call the connections api when there is no invitation code (because they have already connected their accounts)', async () => {
  nock(apiUrl).post('/webhook/users/connections').reply(200);

  await onExecutePostLogin(
    {
      ...eventBase,
      request: {
        ...eventBase.request,
        query: {},
      },
      user: { ...user, user_id: 'auth0|abc123' },
    },
    apiBase,
  );
  expect(nock.isDone()).toBe(false);
  expect(apiBase.access.deny).not.toBeCalled();
});

it('should deny access if the backend throws an error and fails connect the user', async () => {
  nock(apiUrl)
    .post('/webhook/users/connections', {
      code: invitation_code,
      userId: user.user_id,
    })
    .reply(404);
  await onExecutePostLogin(eventBase, apiBase);
  expect(nock.isDone()).toBe(true);
  expect(apiBase.access.deny).toBeCalled();
});
