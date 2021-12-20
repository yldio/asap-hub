import encode from 'jwt-encode';
import nock from 'nock';
import { GetAccessToken, getAccessTokenFactory } from '../src/auth';
import config from '../src/config';

describe('Get Access Token', () => {
  let getAccessToken: GetAccessToken;

  const mockToken = encode(
    {
      exp: Math.floor((new Date().getTime() + 1) / 1000),
      nbf: Math.floor(new Date().getTime() / 1000),
    },
    'secret',
  );

  beforeEach(() => {
    getAccessToken = getAccessTokenFactory();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test('Should fetch the token from squidex and return it', async () => {
    nock(config.baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          config.clientId,
        )}&client_secret=${config.clientSecret}`,
      )
      .reply(200, {
        access_token: mockToken,
        expires_in: 2592000,
        token_type: 'Bearer',
        scope: 'squidex-api',
      });

    expect(await getAccessToken()).toBe(mockToken);
  });

  test('Should throw an exception and attach squidex response to the error message', async () => {
    nock(config.baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          config.clientId,
        )}&client_secret=${config.clientSecret}`,
      )
      .reply(521, { error: 'some error' });

    await expect(getAccessToken()).rejects.toThrow('some error');
  });

  test('Should call Squidex only once for multiple consecutive requests', async () => {
    const scope = nock(config.baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          config.clientId,
        )}&client_secret=${config.clientSecret}`,
      )
      .reply(200, {
        access_token: mockToken,
        expires_in: 2592000,
        token_type: 'Bearer',
        scope: 'squidex-api',
      });
    await getAccessToken();
    await getAccessToken();

    scope.isDone();
  });

  test('Should send out only a single request and await the response when multiple requests are sent at once', async () => {
    const scope = nock(config.baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          config.clientId,
        )}&client_secret=${config.clientSecret}`,
      )
      .reply(200, {
        access_token: mockToken,
        expires_in: 2592000,
        token_type: 'Bearer',
        scope: 'squidex-api',
      });
    const p1 = getAccessToken();
    const p2 = getAccessToken();

    await Promise.all([p1, p2]);

    scope.isDone();
  });

  test('Should retry after a failed attempt', async () => {
    nock(config.baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          config.clientId,
        )}&client_secret=${config.clientSecret}`,
      )
      .reply(521, { error: 'some error' });

    await expect(getAccessToken()).rejects.toThrow();

    nock(config.baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          config.clientId,
        )}&client_secret=${config.clientSecret}`,
      )
      .reply(200, {
        access_token: mockToken,
        expires_in: 2592000,
        token_type: 'Bearer',
        scope: 'squidex-api',
      });

    expect(await getAccessToken()).toBe(mockToken);
  });
});
