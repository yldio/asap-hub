import {
  isValidationErrorResponse,
  VALIDATION_ERROR_MESSAGE,
} from '../src/error';

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
});
