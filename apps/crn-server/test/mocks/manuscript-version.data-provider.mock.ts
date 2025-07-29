import { ManuscriptVersionDataProvider } from '../../src/data-providers/types';

export const manuscriptVersionDataProviderMock = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
} as unknown as jest.Mocked<ManuscriptVersionDataProvider>;
