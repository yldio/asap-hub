import ResearchTagController from '../../src/controllers/research-tags.controller';

export const researchTagControllerMock = {
  fetch: jest.fn(),
  fetchAll: jest.fn(),
} as unknown as jest.Mocked<ResearchTagController>;
