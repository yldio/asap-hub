import { ValidationErrorResponse } from '@asap-hub/model';
import {
  createListApiUrl,
  createSentryHeaders,
  validationErrorsAreSupported,
  clearAjvErrorForPath,
} from '../api-util';

export const CARD_VIEW_PAGE_SIZE = 10;
const testUrl = new URL('test', `https://test.com`);

const mockSetTag = jest.fn();
jest.mock('@sentry/react', () => ({
  configureScope: jest.fn((callback) => callback({ setTag: mockSetTag })),
}));

describe('createListApiUrl', () => {
  it('uses defaults for take and skip params', async () => {
    const url = createListApiUrl(testUrl, {
      pageSize: CARD_VIEW_PAGE_SIZE,
      currentPage: 0,
      searchQuery: '',
      filters: new Set(),
    });
    expect(url.search).toMatchInlineSnapshot(`"?take=10&skip=0"`);
  });
  it('calculates take and skip from params', async () => {
    const url = createListApiUrl(testUrl, {
      currentPage: 2,
      pageSize: 10,
      filters: new Set(),
      searchQuery: '',
    });
    expect(url.searchParams.get('take')).toEqual('10');
    expect(url.searchParams.get('skip')).toEqual('20');
  });

  it('handles requests with a search query', async () => {
    const url = createListApiUrl(testUrl, {
      searchQuery: 'test123',
      filters: new Set(),
      pageSize: CARD_VIEW_PAGE_SIZE,
      currentPage: 0,
    });
    expect(url.searchParams.get('search')).toEqual('test123');
  });
  it('handles requests with filters', async () => {
    const url = createListApiUrl(testUrl, {
      filters: new Set(['123', '456']),
      currentPage: 0,
      pageSize: CARD_VIEW_PAGE_SIZE,
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
  it('sets the conte a header with a random string', () => {
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
      Array [
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
    message: 'Validation Error',
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
