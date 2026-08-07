import {
  isServerValidationError,
  isValidationErrorResponse,
  ServerValidationError,
  ValidationErrorResponse,
  VALIDATION_ERROR_MESSAGE,
} from '../src/error';

const validationErrors: ValidationErrorResponse['data'] = [
  {
    instancePath: '/title',
    keyword: 'unique',
    message: 'must be unique',
    params: {},
    schemaPath: '#/properties/title/unique',
  },
];

describe('Error Model', () => {
  describe('isValidationErrorResponse', () => {
    test('Should recognise validation error', () => {
      expect(
        isValidationErrorResponse({
          error: 'Bad Request',
          message: VALIDATION_ERROR_MESSAGE,
          statusCode: 400,
          data: [],
        }),
      ).toEqual(true);
    });

    test('Should not recognise validation error', () => {
      expect(
        isValidationErrorResponse({
          error: 'Bad Request',
          message: 'Some Other Error',
          statusCode: 400,
          data: {},
        }),
      ).toEqual(false);
    });
  });

  describe('ServerValidationError', () => {
    test('Should carry the validation errors', () => {
      expect(
        new ServerValidationError(validationErrors).validationErrors,
      ).toEqual(validationErrors);
    });

    test('Should be an error with the validation error message', () => {
      const error = new ServerValidationError(validationErrors);

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(VALIDATION_ERROR_MESSAGE);
      expect(error.name).toEqual('ServerValidationError');
    });
  });

  describe('isServerValidationError', () => {
    test('Should recognise server validation error', () => {
      expect(
        isServerValidationError(new ServerValidationError(validationErrors)),
      ).toEqual(true);
    });

    test('Should recognise an error named ServerValidationError built by another copy of the class', () => {
      const error = new Error(VALIDATION_ERROR_MESSAGE);
      error.name = 'ServerValidationError';

      expect(isServerValidationError(error)).toEqual(true);
    });

    test('Should not recognise another error', () => {
      expect(
        isServerValidationError(new Error(VALIDATION_ERROR_MESSAGE)),
      ).toEqual(false);
    });

    test('Should not recognise a non error with the same name', () => {
      expect(
        isServerValidationError({
          name: 'ServerValidationError',
          validationErrors,
        }),
      ).toEqual(false);
    });

    test('Should not recognise undefined', () => {
      expect(isServerValidationError(undefined)).toEqual(false);
    });
  });
});
