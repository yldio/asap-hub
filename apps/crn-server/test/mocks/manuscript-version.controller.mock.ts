import ManuscriptVersionController from '../../src/controllers/manuscript-version.controller';

export const manuscriptVersionControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
} as unknown as jest.Mocked<ManuscriptVersionController>;
