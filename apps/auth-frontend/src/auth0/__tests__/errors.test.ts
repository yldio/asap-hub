import { extractErrorMessage, Auth0Rule } from '../errors';

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

  it('returns a custom message for a known error', () => {
    const error = new Error() as any;
    error.code = 'invalid_user_password';

    expect(extractErrorMessage(error)).toMatch(
      /e-?mail or password.+incorrect/i,
    );
  });

  it.each(errorKeys)('ignores a missing %s', (errorKey) => {
    const error = new Error() as any;
    error[errorKey] = null;

    expect(extractErrorMessage(error)).toMatch(/unknown.+error/i);
  });

  describe('for a complex error description', () => {
    it.each<[string, Auth0Rule[], string]>([
      [
        'concatenates rule messages',
        [
          { message: 'At least 4 characters', verified: false },
          { message: 'Not all the same characters', verified: false },
        ],
        'At least 4 characters\nNot all the same characters',
      ],
      [
        'leaves out a verified rule message',
        [
          { message: 'At least 4 characters', verified: true },
          { message: 'Not all the same characters', verified: false },
        ],
        'Not all the same characters',
      ],
      [
        'falls back to a generic message if there are no unverified rules',
        [
          { message: 'At least 4 characters', verified: true },
          { message: 'Not all the same characters', verified: true },
        ],
        'Unknown',
      ],
      [
        'includes rule item messages with a tick/cross',
        [
          { message: 'At least 4 characters', verified: true },
          {
            message: 'Not too many of the same characters:',
            verified: false,
            items: [
              {
                message: 'Not more than half of the same character',
                verified: true,
              },
              {
                message: 'At least three different characters',
                verified: false,
              },
            ],
          },
        ],
        'Not too many of the same characters:\n✔ Not more than half of the same character\n✖ At least three different characters',
      ],
      [
        'formats the message',
        [
          { message: 'At least %d characters', format: [4], verified: false },
          { message: 'Not all the same characters', verified: false },
        ],
        'At least 4 characters\nNot all the same characters',
      ],
    ])('%s', (name, rules, expected) => {
      const error = new Error() as any;
      error.description = { rules };

      expect(extractErrorMessage(error)).toContain(expected);
    });
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */
});
