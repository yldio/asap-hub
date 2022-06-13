import nock from 'nock';
import { GetAccessToken, getAccessTokenFactory } from '../src/auth';
import { getMockToken } from './mocks/access-token.mock';

describe('Get Access Token', () => {
  let getAccessToken: GetAccessToken;

  const oneHourFromNow = new Date(new Date().getTime() + 3600 * 1000);
  const mockToken = getMockToken(oneHourFromNow);
  const baseUrl = 'http://test-url.com';
  const clientId = 'test-client-id';
  const clientSecret = 'test-client-secret';

  beforeEach(() => {
    getAccessToken = getAccessTokenFactory({ baseUrl, clientId, clientSecret });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test('Should fetch the token from squidex and return it', async () => {
    nock(baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          clientId,
        )}&client_secret=${clientSecret}`,
      )
      .reply(200, {
        access_token: mockToken,
        expires_in: 2592000,
        token_type: 'Bearer',
        scope: 'squidex-api',
      });

    expect(await getAccessToken()).toBe(mockToken);
  });

  describe('Expiration and caching for multiple requests', () => {
    test('Should use the cached token with expiration date ahead of current time', async () => {
      const oneHourFromNow = new Date(new Date().getTime() + 3600 * 1000);
      const mockTokenFresh = getMockToken(oneHourFromNow);

      const nockScope = nock(baseUrl)
        .post(
          '/identity-server/connect/token',
          `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
            clientId,
          )}&client_secret=${clientSecret}`,
        )
        .reply(200, {
          access_token: mockTokenFresh,
          expires_in: Math.floor(oneHourFromNow.getTime() / 1000),
          token_type: 'Bearer',
          scope: 'squidex-api',
        });

      // fetch the token
      await getAccessToken();
      // the token should be cached and be used as it is still valid
      await getAccessToken();

      expect(nockScope.isDone()).toBe(true);
    });

    test('Should not use the cached token with expiration date in the past and fetch a new one', async () => {
      const oneHourAgo = new Date(new Date().getTime() - 3600 * 1000);
      const mockTokenStale = getMockToken(oneHourAgo);

      const nockScope = nock(baseUrl)
        .post(
          '/identity-server/connect/token',
          `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
            clientId,
          )}&client_secret=${clientSecret}`,
        )
        .twice()
        .reply(200, {
          access_token: mockTokenStale,
          expires_in: Math.floor(oneHourAgo.getTime() / 1000),
          token_type: 'Bearer',
          scope: 'squidex-api',
        });

      // fetch the token
      await getAccessToken();
      // the token should be cached but expired and therefore it should call the auth endpoint twice
      await getAccessToken();

      expect(nockScope.isDone()).toBe(true);
    });
  });

  test('Should throw an exception and attach squidex response to the error message', async () => {
    nock(baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          clientId,
        )}&client_secret=${clientSecret}`,
      )
      .reply(521, { error: 'some error' });

    await expect(getAccessToken()).rejects.toThrow('some error');
  });

  test('Should send out only a single request and await the response when multiple requests are sent at once', async () => {
    const scope = nock(baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          clientId,
        )}&client_secret=${clientSecret}`,
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
    nock(baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          clientId,
        )}&client_secret=${clientSecret}`,
      )
      .reply(521, { error: 'some error' });

    await expect(getAccessToken()).rejects.toThrow();

    nock(baseUrl)
      .post(
        '/identity-server/connect/token',
        `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
          clientId,
        )}&client_secret=${clientSecret}`,
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
