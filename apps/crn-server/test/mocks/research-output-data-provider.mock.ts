import { ResearchOutputDataProvider } from '../../src/data-providers/research-outputs.data-provider';

export const researchOutputDataProviderMock: jest.Mocked<ResearchOutputDataProvider> =
  {
    fetch: jest.fn(),
    fetchById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
