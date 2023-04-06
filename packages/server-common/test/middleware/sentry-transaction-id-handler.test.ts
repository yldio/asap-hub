import { Request, Response } from 'express';
import { Logger, LoggerOptions } from 'pino';
import { sentryTransactionIdMiddleware } from '../../src/middleware';
import { loggerMock } from '../mocks/logger.mock';

const mockSetTag = jest.fn();
jest.mock('@sentry/serverless', () => ({
  configureScope: jest.fn((callback) => callback({ setTag: mockSetTag })),
}));
describe('sentry-transaction-id-handler', () => {
  interface PermissionRequest extends Request<unknown> {
    log: Logger<LoggerOptions>;
  }

  test('next is called with no transaction Id, and warning logged', () => {
    const originalUrl = 'http://example.com/the-original';
    const next = jest.fn();
    const warn = jest.fn();
    const req = {
      header: jest.fn(),
      log: { ...loggerMock, warn },
      originalUrl,
    } as Partial<PermissionRequest>;
    sentryTransactionIdMiddleware(
      req as PermissionRequest,
      {} as Response,
      next,
    );
    expect(next).toBeCalled();
    expect(warn).toBeCalledWith(
      `No transaction id on request to ${originalUrl}`,
    );
  });

  test('next is called with transaction Id, and scope is set', () => {
    const originalUrl = 'http://example.com/the-original';
    const next = jest.fn();
    const warn = jest.fn();

    const header = jest.fn().mockReturnValue('42') as jest.MockedFunction<
      Request['header']
    >;

    const req = {
      header,
      log: { ...loggerMock, warn },
      originalUrl,
    } as Partial<PermissionRequest>;
    sentryTransactionIdMiddleware(
      req as PermissionRequest,
      {} as Response,
      next,
    );
    expect(mockSetTag).toHaveBeenLastCalledWith('transaction_id', '42');
    expect(next).toBeCalled();
    expect(warn).not.toBeCalled();
  });
});
