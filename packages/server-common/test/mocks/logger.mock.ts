import { Logger } from '../../src/utils/logger';

export const loggerMock = {
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  child: () => loggerMock,
} as unknown as jest.Mocked<Logger>;
