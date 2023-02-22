import { GenericError } from '@asap-hub/errors';

interface MiddlewareError extends Error {
  status?: number | string;
  statusCode?: number | string;
  status_code?: number | string;
  output?: {
    statusCode?: number | string;
  };
  response?: {
    statusCode?: number | string;
  };
}

// adapted from https://github.com/getsentry/sentry-javascript/blob/a88a8bf0f26d12adde87738a3c9f56658397af9a/packages/node/src/handlers.ts#L237
const getStatusCodeFromResponse = (error: MiddlewareError): number => {
  const statusCode =
    error.status ||
    error.statusCode ||
    error.status_code ||
    (error.output && error.output.statusCode) ||
    (error.response && error.response.statusCode) ||
    (error instanceof GenericError ? '400' : '500');

  return parseInt(statusCode as string, 10);
};

export const shouldHandleError = (error: MiddlewareError) => {
  const statusCode = getStatusCodeFromResponse(error);

  return statusCode >= 500;
};
