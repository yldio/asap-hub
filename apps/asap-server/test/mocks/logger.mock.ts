import { Logger } from 'winston';

export const loggerMock = ({
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
} as unknown) as jest.Mocked<Logger>;
