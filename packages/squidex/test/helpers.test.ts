import { HTTPError } from 'got';
import { parseErrorResponseBody } from '../src/helpers';

describe('parseErrorResponse', () => {
  const body = {
    details: ['Request  body has an invalid format'],
    message: 'The model is not valid',
  };
  test('body is string', async () => {
    const err = {
      response: {
        body: JSON.stringify(body),
      },
    } as HTTPError;
    const result = parseErrorResponseBody(err);
    expect(result).toEqual(body);
  });
  test('body is Json', async () => {
    const err = {
      response: {
        body: body,
      },
    } as HTTPError;
    const result = parseErrorResponseBody(err);
    expect(result).toEqual(body);
  });
});
