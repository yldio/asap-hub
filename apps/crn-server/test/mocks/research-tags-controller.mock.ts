import { ResearchTagController } from '../../src/controllers/research-tags.controller';

export const researchTagControllerMock: jest.Mocked<ResearchTagController> = {
  fetch: jest.fn(),
  fetchAll: jest.fn(),
};
