import { GenerativeContentDataProvider } from '../../src/data-providers/contentful/generative-content.data-provider';

export const generativeContentDataProviderMock = {
  summariseContent: jest.fn(),
} as unknown as jest.Mocked<GenerativeContentDataProvider>;
