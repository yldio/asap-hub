import { ResearchOutputController } from '../../src/controllers/research-outputs';

export const researchOutputControllerMock: jest.Mocked<ResearchOutputController> =
  {
    fetch: jest.fn(),
    fetchById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
