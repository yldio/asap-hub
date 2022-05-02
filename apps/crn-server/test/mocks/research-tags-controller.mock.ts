import { ResearchTagController } from '../../src/controllers/research-tags';

export const researchTagControllerMock: jest.Mocked<ResearchTagController> = {
  fetch: jest.fn(),
};
