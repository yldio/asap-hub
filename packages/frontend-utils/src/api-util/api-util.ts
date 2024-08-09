import { ErrorResponse, ValidationErrorResponse } from '@asap-hub/model';
import { getCurrentScope } from '@sentry/react';

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
  getCurrentScope().setTag('transaction_id', transactionId);
  return {
    'X-Transaction-Id': transactionId,
  };
};

export class BackendError extends Error {
  public response;
  public statusCode;
  constructor(
    message: string,
    response: ErrorResponse | ValidationErrorResponse,
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
