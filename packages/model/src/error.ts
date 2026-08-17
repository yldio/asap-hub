import { ErrorObject } from 'ajv';

export const VALIDATION_ERROR_MESSAGE = 'Validation error';

export type ValidationErrorResponse = {
  error: 'Bad Request';
  message: typeof VALIDATION_ERROR_MESSAGE;
  statusCode: 400;
  data: ErrorObject<string, Record<string, unknown>, unknown>[];
};

export type ErrorResponse =
  | ValidationErrorResponse
  | {
      error: string;
      message: string;
      statusCode: number;
      data?: Record<string, unknown>;
    };

export const isValidationErrorResponse = (
  error: ErrorResponse,
): error is ValidationErrorResponse =>
  error.message.startsWith(VALIDATION_ERROR_MESSAGE);

export class ServerValidationError extends Error {
  readonly validationErrors: ValidationErrorResponse['data'];

  constructor(validationErrors: ValidationErrorResponse['data']) {
    super(VALIDATION_ERROR_MESSAGE);
    this.name = 'ServerValidationError';
    this.validationErrors = validationErrors;
  }
}

export const isServerValidationError = (
  error: unknown,
): error is ServerValidationError =>
  error instanceof Error && error.name === 'ServerValidationError';
