import { ErrorObject } from 'ajv';

export type ValidationErrorResponse = {
  error: 'Bad Request';
  message: 'Validation error';
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
): error is ValidationErrorResponse => error.message === 'Validation error';
