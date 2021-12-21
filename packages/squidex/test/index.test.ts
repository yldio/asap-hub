import encode from 'jwt-encode';
import nock from 'nock';
import { config, SquidexGraphql, SquidexRest } from '../src';

describe('Squidex package', () => {
  const mockToken = encode(
    {
      exp: Math.floor((new Date().getTime() + 3600 * 1000) / 1000),
      nbf: Math.floor(new Date().getTime() / 1000),
    },
    'secret',
  );

  const squidexGraphqlClient = new SquidexGraphql();
  const squidexRestClient = new SquidexRest('user');

  test('Should fetch the token only once for multiple graphql and REST calls', async () => {
    // get the token once
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

    // make graphql query to Squidex
    nock(config.baseUrl)
      .post(
        `/api/content/${config.appName}/graphql`,
        JSON.stringify({ query: '{ id }' }),
      )
      .reply(200, {
        data: {
          id: 'id',
        },
      });

    // make a REST call to squidex
    nock(config.baseUrl)
      .get(
        `/api/content/${config.appName}/user?q=${JSON.stringify({
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
