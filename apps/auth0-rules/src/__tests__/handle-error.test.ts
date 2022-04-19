import { handleError } from '../handle-error';

describe('handle errors', () => {
  test('should handle Errors', async () => {
    const error = new Error('test');

    const value = handleError(error);
    expect(value).not.toBeNull();
    expect(value).toEqual(error);
  });

  test.each([
    'What?!',
    11,
    { what: 'is this' },
    null,
    new Promise(() => {}),
    undefined,
  ])('should handle non Errors, %s', async (literal) => {
    const throwLiteral = () => {
      try {
        throw literal;
      } catch (err) {
        return handleError(err);
      }
    };
    const value = throwLiteral();
    expect(value.message).toEqual('Unexpected Error');
  });
});
