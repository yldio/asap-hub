import { logger } from '../../src/utils';

export const loggerMock: jest.Mock<typeof logger> = jest.fn();
