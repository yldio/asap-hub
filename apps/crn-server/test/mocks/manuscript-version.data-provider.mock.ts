import { ManuscriptVersionDataProvider } from '../../src/data-providers/types';

export const manuscriptVersionDataProviderMock = {
  fetchById: jest.fn(),
  fetch: jest.fn(),
  fetchComplianceManuscriptVersions: jest.fn(),
  fetchManuscriptVersionIdsByLinkedEntry: jest.fn(),
} as unknown as jest.Mocked<ManuscriptVersionDataProvider>;
