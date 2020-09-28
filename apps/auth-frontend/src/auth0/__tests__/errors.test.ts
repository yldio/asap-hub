import { extractErrorMessage } from '../errors';

describe('extractErrorMessage', () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const errorKeys = [
    'error_description',
    'errorDescription',
    'description',
    'message',
  ] as const;

  it.each(errorKeys)('extracts the %s', (errorKey) => {
    const error = new Error() as any;
    error[errorKey] = 'oopsie';

    expect(extractErrorMessage(error)).toContain('oopsie');
  });

  it.each(errorKeys)('ignores a missing %s', (errorKey) => {
    const error = new Error() as any;
    error[errorKey] = null;

    expect(extractErrorMessage(error)).toMatch(/unknown.+error/i);
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */
});
