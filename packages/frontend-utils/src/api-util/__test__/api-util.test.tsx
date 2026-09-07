import {
  ServerValidationError,
  ValidationErrorResponse,
} from '@asap-hub/model';
import {
  BackendError,
  createListApiUrlFactory,
  createSentryHeaders,
  validationErrorsAreSupported,
  clearAjvErrorForPath,
  toServerValidationError,
  getTimezone,
} from '../api-util';

const mockSetTag = jest.fn();
jest.mock('@sentry/react', () => ({
  getCurrentScope: () => ({
    setTag: mockSetTag,
  }),
}));

const baseUrl = `https://example.com`;

const createListApiUrl = createListApiUrlFactory(baseUrl);

describe('BackendError', () => {
  it('creates a well formed error', () => {
    const response = {
      error: 'not found',
      message: 'page not found',
      statusCode: 404,
    };
    const error = new BackendError('message', response, 404);
    expect(error.message).toBe('message');
    expect(error.statusCode).toBe(404);
    expect(error.response).toBe(response);
  });
});

describe('createListApiUrl', () => {
  it('uses defaults for take and skip params', async () => {
    const url = createListApiUrl('test', {
      pageSize: 10,
      currentPage: 0,
      searchQuery: '',
      filters: new Set(),
    });
    expect(url.search).toMatchInlineSnapshot(`"?take=10&skip=0"`);
  });
  it('calculates take and skip from params', async () => {
    let url = createListApiUrl('test', {
      currentPage: 2,
      pageSize: 10,
      filters: new Set(),
      searchQuery: '',
    });
    expect(url.searchParams.get('take')).toEqual('10');
    expect(url.searchParams.get('skip')).toEqual('20');

    url = createListApiUrl('test', {
      currentPage: null,
      pageSize: null,
      filters: new Set(),
      searchQuery: '',
    });
    expect(url.searchParams.get('take')).toEqual(null);
    expect(url.searchParams.get('skip')).toEqual(null);

    url = createListApiUrl('test', {
      currentPage: null,
      pageSize: 10,
      filters: new Set(),
      searchQuery: '',
    });
    expect(url.searchParams.get('take')).toEqual('10');
    expect(url.searchParams.get('skip')).toEqual(null);
  });

  it('handles requests with a search query', async () => {
    const url = createListApiUrl('test', {
      searchQuery: 'test123',
      filters: new Set(),
      pageSize: 10,
      currentPage: 0,
    });
    expect(url.searchParams.get('search')).toEqual('test123');
  });
  it('handles requests with filters', async () => {
    const url = createListApiUrl('test', {
      filters: new Set(['123', '456']),
      currentPage: 0,
      pageSize: 10,
      searchQuery: '',
    });
    expect(url.searchParams.getAll('filter')).toEqual(['123', '456']);
  });
});

describe('createSentryHeaders', () => {
  it('generates a header with a random string', () => {
    expect(createSentryHeaders()).toEqual({
      'X-Transaction-Id': expect.anything(),
    });
  });
  it('sets the transaction header with a random string', () => {
    const { 'X-Transaction-Id': transactionId } = createSentryHeaders();
    expect(mockSetTag).toHaveBeenLastCalledWith(
      'transaction_id',
      transactionId,
    );
  });
});

const validationError: ValidationErrorResponse['data'][number] = {
  instancePath: '/example',
  keyword: '',
  params: {},
  schemaPath: '',
};
describe('clearAjvErrorForPath', () => {
  it('removes errors for given path', () => {
    expect(
      clearAjvErrorForPath(
        [
          { ...validationError, instancePath: '/url' },
          { ...validationError, instancePath: '/test' },
          { ...validationError, instancePath: '/test' },
          { ...validationError, instancePath: '/title' },
        ],

        '/test',
      ).map(({ instancePath }) => instancePath),
    ).toMatchInlineSnapshot(`
      [
        "/url",
        "/title",
      ]
    `);
  });
});

describe('validationErrorsAreSupported', () => {
  const validationResponse: ValidationErrorResponse = {
    error: 'Bad Request',
    data: [],
    message: 'Validation error',
    statusCode: 400,
  };
  it('passes if all path instance are supported', () => {
    expect(
      validationErrorsAreSupported(
        {
          ...validationResponse,
          data: [
            { ...validationError, instancePath: '/3' },
            { ...validationError, instancePath: '/1' },
            { ...validationError, instancePath: '/2' },
          ],
        },
        ['/1', '/2', '/3'],
      ),
    ).toBe(true);
  });

  it('fails if not all pathInstances are supported', () => {
    expect(
      validationErrorsAreSupported(
        {
          ...validationResponse,
          data: [
            { ...validationError, instancePath: '/3' },
            { ...validationError, instancePath: '/1' },
            { ...validationError, instancePath: '/2' },
          ],
        },
        ['/2', '/3'],
      ),
    ).toBe(false);
  });

  it('fails if there is a validation error but no errors to handle', () => {
    expect(
      validationErrorsAreSupported(
        {
          ...validationResponse,
          data: [],
        },
        ['/2', '/3'],
      ),
    ).toBe(false);
  });
});

describe('toServerValidationError', () => {
  const convert = toServerValidationError(['/contactEmail']);

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

  const capture = (error: unknown) => {
    try {
      convert(error);
      return undefined;
    } catch (thrown) {
      return thrown;
    }
  };

  it('converts a supported validation response', () => {
    const thrown = capture(backendError(validationBody('/contactEmail')));

    expect(thrown).toBeInstanceOf(ServerValidationError);
    expect((thrown as ServerValidationError).validationErrors).toEqual(
      validationBody('/contactEmail').data,
    );
  });

  // The predicate is all-or-nothing on the returned paths: a caller that cannot
  // render every one of them must keep the generic report instead.
  it('rethrows unchanged when a path is not supported', () => {
    const error = backendError(validationBody('/jobTitle'));

    expect(capture(error)).toBe(error);
  });

  it('rethrows a non-BackendError unchanged', () => {
    const error = new Error('boom');

    expect(capture(error)).toBe(error);
  });

  // isValidationErrorResponse reads `.message` without a nil guard, and callers
  // build the body from `resp.json().catch(() => undefined)`.
  it.each([
    ['the body is absent', undefined],
    ['the body is not an object', 'upstream exploded'],
    ['the body is null', null],
    ['the body has no message', { statusCode: 400 }],
    [
      'the body has data but no message',
      { statusCode: 400, data: [{ instancePath: '/contactEmail' }] },
    ],
    [
      'data is not a list',
      {
        error: 'Bad Request',
        message: 'Validation error',
        statusCode: 400,
        data: null,
      },
    ],
    [
      'the response is not a validation error',
      {
        error: 'Forbidden',
        message: 'Forbidden',
        statusCode: 403,
      },
    ],
  ])('rethrows unchanged when %s', (_label, response) => {
    const error = backendError(response);
    const thrown = capture(error);

    expect(thrown).toBe(error);
    expect(thrown).not.toBeInstanceOf(TypeError);
  });
});

describe('getTimezone', () => {
  it('returns UTC+{hours} for timezone ahead of UTC', async () => {
    const date = {
      getTimezoneOffset() {
        return -600;
      },
    } as Date;

    expect(getTimezone(date)).toBe('UTC+10');
  });

  it('returns UTC-{hours} for timezone behind of UTC', async () => {
    const date = {
      getTimezoneOffset() {
        return 180;
      },
    } as Date;

    expect(getTimezone(date)).toBe('UTC-3');
  });

  it('returns UTC for timezone equal to UTC', async () => {
    const date = {
      getTimezoneOffset() {
        return 0;
      },
    } as Date;

    expect(getTimezone(date)).toBe('UTC');
  });
});
