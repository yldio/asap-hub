import { errorResponse } from '../../src/framework/helpers';

describe('handle errors', () => {
  test('should handle Errors', async () => {
    const error = new Error('test');

    const value = errorResponse(error);
    expect(value).not.toBeNull();
    expect(value.statusCode).toEqual(400);
    expect(value.body).toEqual(
      '{"statusCode":400,"error":"Bad Request","message":"test"}',
    );
  });

  test.each([
    'What?!',
    11,
    { what: 'is this' },
    null,
    new Promise(() => {}),
    undefined,
  ])('throwing literals returns 500 %s', async (literal) => {
    const throwLiteral = () => {
      try {
        throw literal;
      } catch (err) {
        return errorResponse(err);
      }
    };
    const value = throwLiteral();
    expect(value).not.toBeNull();
    expect(value.statusCode).toEqual(500);
    expect(value.body).toEqual('Unexpected Error');
  });
});
