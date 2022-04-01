import {
  ErrorResponse,
  ValidationErrorResponse,
  isValidationErrorResponse,
} from '@asap-hub/model';
import { configureScope } from '@sentry/react';
import { API_BASE_URL } from './config';

export type GetListOptions = {
  searchQuery: string;
  filters: Set<string>;
  currentPage: number | null;
  pageSize: number | null;
};

export const createListApiUrl = (
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
  filters.forEach((filter) => url.searchParams.append('filter', filter));

  return url;
};

export const createSentryHeaders = () => {
  const transactionId = Math.random().toString(36).substr(2, 9);
  configureScope((scope) => {
    scope.setTag('transaction_id', transactionId);
  });
  return {
    'X-Transaction-Id': transactionId,
  };
};

export const BACKEND_ERROR_NAME = 'BackendError';
export class BackendError extends Error {
  public response;
  public statusCode;
  constructor(
    message: string,
    response: ErrorResponse | ValidationErrorResponse,
    statusCode: number,
  ) {
    super(message);
    this.name = BACKEND_ERROR_NAME;
    this.statusCode = statusCode;
    this.response = response;
  }
}

export const getHandledValidationErrors = (
  { response }: BackendError,
  supportedErrorPaths: string[],
) =>
  isValidationErrorResponse(response) &&
  response.data.length &&
  response.data.every(({ instancePath }) =>
    supportedErrorPaths.includes(instancePath),
  )
    ? response.data
    : false;
