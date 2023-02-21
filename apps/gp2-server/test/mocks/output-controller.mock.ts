import { OutputController } from '../../src/controllers/output.controller';

export const outputControllerMock: jest.Mocked<OutputController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};
