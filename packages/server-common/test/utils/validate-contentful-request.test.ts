import Boom from '@hapi/boom';
import { validateContentfulRequest } from '../../src/utils/validate-contentful-request';

const authenticationToken = 'shared_secret';

describe('Verifies Squidex webhook payload signature', () => {
  test('throws 403 when authorization header is not defined', async () => {
    expect(() =>
      validateContentfulRequest(
        {
          method: 'post',
          headers: {},
          rawPayload: '',
          payload: undefined,
        },
        authenticationToken,
      ),
    ).toThrow(Boom.unauthorized());
  });

  test('throws 401 when X-Signature header does not match', async () => {
    expect(() =>
      validateContentfulRequest(
        {
          method: 'post',
          headers: {
            authorization: 'invalidSignature',
          },
          rawPayload: '',
          payload: undefined,
        },
        authenticationToken,
      ),
    ).toThrow(Boom.forbidden());
  });

  test('returns true when signature is valid', async () => {
    const res = validateContentfulRequest(
      {
        method: 'post',
        headers: {
          authorization: authenticationToken,
        },
        rawPayload: '',
        payload: undefined,
      },
      authenticationToken,
    );
    expect(res).toBe(true);
  });
});
