import ManuscriptController from '../../src/controllers/manuscript.controller';

export const manuscriptControllerMock = {
  fetchById: jest.fn(),
  create: jest.fn(),
} as unknown as jest.Mocked<ManuscriptController>;
