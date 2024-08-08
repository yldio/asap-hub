import ResearchOutputController from '../../src/controllers/research-output.controller';

export const researchOutputControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  generateContent: jest.fn(),
} as unknown as jest.Mocked<ResearchOutputController>;
