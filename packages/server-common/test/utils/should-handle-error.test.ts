import { NotFoundError, ValidationError } from '@asap-hub/errors';
import { Boom } from '@hapi/boom';
import { HTTPError, Response } from 'got/dist/source';
import { shouldHandleError } from '../../src/utils/should-handle-error';

describe('shouldHandleError', () => {
  test.each`
    statusCode | expected
    ${500}     | ${true}
    ${501}     | ${true}
    ${502}     | ${true}
    ${503}     | ${true}
    ${400}     | ${false}
    ${401}     | ${false}
    ${402}     | ${false}
    ${403}     | ${false}
    ${404}     | ${false}
  `(
    `should return $expected for $statusCode HTTPError`,
    ({ statusCode, expected }) => {
      const errResponse = {
        statusCode,
      } as unknown as Response;
      const httpError = new HTTPError(errResponse);
      // @ts-ignore
      // https://github.com/sindresorhus/got/issues/1210#issuecomment-623534449
      httpError.response = errResponse;
      expect(shouldHandleError(httpError)).toBe(expected);
    },
  );

  test.each`
    statusCode | expected
    ${500}     | ${true}
    ${501}     | ${true}
    ${502}     | ${true}
    ${503}     | ${true}
    ${400}     | ${false}
    ${401}     | ${false}
    ${402}     | ${false}
    ${403}     | ${false}
    ${404}     | ${false}
  `(
    `should return $expected for $statusCode Boom Error`,
    ({ statusCode, expected }) => {
      const error = new Boom(`${statusCode} error`, { statusCode });
      expect(shouldHandleError(error)).toBe(expected);
    },
  );

  test('should return false for NotFoundError', async () => {
    const error = new NotFoundError(undefined, `NotFoundError`);
    expect(shouldHandleError(error)).toBe(false);
  });

  test('should return false for ValidationError', async () => {
    const error = new ValidationError(undefined, undefined, 'ValidationError');
    expect(shouldHandleError(error)).toBe(false);
  });

  test('should return true for Error', async () => {
    const error = new Error('Error');
    expect(shouldHandleError(error)).toBe(true);
  });
});
