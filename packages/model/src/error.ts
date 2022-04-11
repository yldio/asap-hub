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
  error.message === VALIDATION_ERROR_MESSAGE;
