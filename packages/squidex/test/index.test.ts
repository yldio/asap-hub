import nock from 'nock';
import encode from 'jwt-encode';
import { getAccessTokenFactory, SquidexGraphql, SquidexRest } from '../src';

describe('Squidex package', () => {
  const mockToken = encode(
    {
      exp: Math.floor((new Date().getTime() + 3600 * 1000) / 1000),
      nbf: Math.floor(new Date().getTime() / 1000),
    },
    'secret',
  );

  const appName = 'test-app';
  const baseUrl = 'http://test-url.com';
  const clientId = 'test-client-id';
  const clientSecret = 'test-client-secret';
  const getAuthToken = getAccessTokenFactory({
    baseUrl,
    clientId,
    clientSecret,
  });
  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    baseUrl,
    appName,
  });
  const squidexRestClient = new SquidexRest(getAuthToken, 'user', {
    appName,
    baseUrl,
  });

  test('Should fetch the token only once for multiple graphql and REST calls', async () => {
    // get the token once
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

    // make graphql query to Squidex
    nock(baseUrl)
      .post(
        `/api/content/${appName}/graphql`,
        JSON.stringify({ query: '{ id }' }),
      )
      .reply(200, {
        data: {
          id: 'id',
        },
      });

    // make a REST call to squidex
    nock(baseUrl)
      .get(
        `/api/content/${appName}/user?q=${JSON.stringify({
          take: 8,
        })}`,
      )
      .reply(200, {
        total: 1,
        items: [
          {
            id: '42',
            data: {
              string: {
                iv: 'value',
              },
            },
          },
        ],
      });

    await squidexGraphqlClient.request('{ id }');
    await squidexRestClient.fetch();

    expect(nock.isDone()).toBe(true);
  });
});
