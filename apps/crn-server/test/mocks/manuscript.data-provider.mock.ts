import { ManuscriptDataProvider } from '../../src/data-providers/types';

export const manuscriptDataProviderMock = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
  create: jest.fn(),
} as unknown as jest.Mocked<ManuscriptDataProvider>;
