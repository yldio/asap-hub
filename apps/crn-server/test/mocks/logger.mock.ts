import { getHttpLogger, Logger } from '@asap-hub/server-common';

export const loggerMock = {
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  child: () => loggerMock,
  levels: [],
} as unknown as jest.Mocked<Logger>;

export const httpLoggerMock = getHttpLogger({ logger: loggerMock });
