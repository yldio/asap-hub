import nock from 'nock';
import encode from 'jwt-encode';
import { cms as squidex } from '../../src/config';

export const identity = () => {
  return nock(squidex.baseUrl)
    .post(
      '/identity-server/connect/token',
      `grant_type=client_credentials&scope=squidex-api&client_id=${encodeURIComponent(
        squidex.clientId,
      )}&client_secret=${squidex.clientSecret}`,
    )
    .reply(200, {
      access_token: encode(
        {
          exp: Math.floor((new Date().getTime() + 1) / 1000),
          nbf: Math.floor(new Date().getTime() / 1000),
        },
        'secret',
      ),
      expires_in: 2592000,
      token_type: 'Bearer',
      scope: 'squidex-api',
    });
};
