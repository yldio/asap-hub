import OutputController from '../../src/controllers/output.controller';
export const outputControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
} as unknown as jest.Mocked<OutputController>;
