import { AlgoliaSearchClient } from '@asap-hub/algolia';

export const algoliaSearchClientMock = {
  save: jest.fn(),
  saveMany: jest.fn(),
  remove: jest.fn(),
  search: jest.fn(),
} as unknown as jest.Mocked<AlgoliaSearchClient>;
