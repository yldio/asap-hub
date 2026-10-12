import {
  ErrorResponse,
  isValidationErrorResponse,
  ServerValidationError,
  ValidationErrorResponse,
} from '@asap-hub/model';
import * as Sentry from '@sentry/react';

export type GetListOptions = {
  searchQuery: string;
  filters: Set<string>;
  currentPage: number | null;
  pageSize: number | null;
};

export const createListApiUrlFactory =
  (API_BASE_URL: string) =>
  (
    endpoint: string,
    { searchQuery, filters, currentPage, pageSize }: GetListOptions,
  ): URL => {
    const url = new URL(endpoint, `${API_BASE_URL}/`);
    if (searchQuery) url.searchParams.set('search', searchQuery);
    if (pageSize !== null) {
      url.searchParams.set('take', String(pageSize));
      if (currentPage !== null) {
        url.searchParams.set('skip', String(currentPage * pageSize));
      }
    }
    filters?.forEach((filter) => url.searchParams.append('filter', filter));

    return url;
  };

export const createSentryHeaders = (): {
  'X-Transaction-Id': string;
} => {
  const transactionId = Math.random().toString(36).substr(2, 9);
  const scope = Sentry.getCurrentScope();
  scope.setTag('transaction_id', transactionId);
  return {
    'X-Transaction-Id': transactionId,
  };
};

export class BackendError extends Error {
  public response;
  public statusCode;
  constructor(
    message: string,
    // Optional because a failing response may carry no JSON body at all —
    // callers build this from `resp.json().catch(() => undefined)`, whose `any`
    // let the non-optional type compile while lying to every reader.
    response: ErrorResponse | ValidationErrorResponse | undefined,
    statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.response = response;
  }
}

export const validationErrorsAreSupported = (
  response: ValidationErrorResponse,
  supportedErrorPaths: string[],
): boolean =>
  !!response.data.length &&
  response.data.every(({ instancePath }) =>
    supportedErrorPaths.includes(instancePath),
  );

/**
 * The validation errors a rejection carries, when every one of them names a path
 * the caller said it can render. `undefined` for anything else, so the caller
 * falls back to whatever generic reporting it already had.
 */
export const getSupportedValidationErrors = (
  error: unknown,
  supportedErrors: string[],
): ValidationErrorResponse['data'] | undefined => {
  if (!(error instanceof BackendError)) return undefined;

  const { response } = error;
  // A failing response body is whatever it parsed to: absent when there was no
  // JSON, or a bare string when it was not an object. Neither
  // isValidationErrorResponse (reads `.message`) nor validationErrorsAreSupported
  // (reads `.data.length`) guards for that.
  return typeof response === 'object' &&
    response !== null &&
    typeof (response as ErrorResponse).message === 'string' &&
    Array.isArray((response as ValidationErrorResponse).data) &&
    isValidationErrorResponse(response) &&
    validationErrorsAreSupported(response, supportedErrors)
    ? response.data
    : undefined;
};

/**
 * Translates a backend validation response into a `ServerValidationError` so the
 * form can surface it through the same path as its own field validation.
 */
export const toServerValidationError =
  (supportedErrors: string[]) =>
  (error: unknown): never => {
    const validationErrors = getSupportedValidationErrors(
      error,
      supportedErrors,
    );
    if (validationErrors) throw new ServerValidationError(validationErrors);
    throw error;
  };

export const clearAjvErrorForPath = (
  errors: ValidationErrorResponse['data'],
  path: string,
): ValidationErrorResponse['data'] =>
  errors.filter(({ instancePath }) => instancePath !== path);

export const getTimezone = (date: Date) => {
  const offset = date.getTimezoneOffset();
  // The number of minutes returned by getTimezoneOffset() is positive if the local time zone is behind UTC,
  // and negative if the local time zone is ahead of UTC. For example, for UTC+10, -600 will be returned.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset#negative_values_and_positive_values

  if (offset > 0) {
    return `UTC-${offset / 60}`;
  }

  if (offset < 0) {
    return `UTC+${offset / -60}`;
  }

  return 'UTC';
};

/* istanbul ignore next */
export const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
