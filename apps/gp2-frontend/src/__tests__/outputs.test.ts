import { BackendError } from '@asap-hub/frontend-utils';
import { ValidationErrorResponse } from '@asap-hub/model';
import { handleError } from '../outputs';

describe('handleError', () => {
  const setErrors = jest.fn();
  const handle = handleError(['/link'], setErrors);

  beforeEach(jest.resetAllMocks);

  const backendError = (response: unknown) =>
    new BackendError('failed', response as ValidationErrorResponse, 400);

  const validationBody = (instancePath: string) => ({
    error: 'Bad Request' as const,
    message: 'Validation error' as const,
    statusCode: 400,
    data: [
      {
        instancePath,
        keyword: 'pattern',
        params: {},
        schemaPath: `#/properties${instancePath}/pattern`,
      },
    ],
  });

  it('reports a supported validation error to the form', () => {
    handle(backendError(validationBody('/link')));

    expect(setErrors).toHaveBeenCalledWith(validationBody('/link').data);
  });

  it('rethrows when a path is not one the form can render', () => {
    const error = backendError(validationBody('/description'));

    expect(() => handle(error)).toThrow(error);
    expect(setErrors).not.toHaveBeenCalled();
  });

  // A failure body is whatever the response parsed to. Reading `.message` or
  // `.data.length` off these threw a TypeError from inside the caller's catch,
  // masking the real API error.
  it.each([
    ['the body is absent', undefined],
    ['the body is not an object', 'upstream exploded'],
    ['the body is null', null],
    ['the body has data but no message', { statusCode: 400, data: [] }],
  ])('rethrows unchanged when %s', (_label, response) => {
    const error = backendError(response);

    expect(() => handle(error)).toThrow(error);
    expect(setErrors).not.toHaveBeenCalled();
  });

  it('rethrows a non-BackendError unchanged', () => {
    const error = new Error('boom');

    expect(() => handle(error)).toThrow(error);
  });
});
