import { ResearchTagDataProvider } from '../../src/data-providers/research-tags.data-provider';

export const researchTagDataProviderMock: jest.Mocked<ResearchTagDataProvider> =
  {
    fetch: jest.fn(),
  };
