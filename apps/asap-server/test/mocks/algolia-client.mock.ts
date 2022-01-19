import { SearchClient, SearchIndex } from '@asap-hub/algolia';

export const algoliaIndexMock = {
  saveObject: jest.fn(),
  deleteObject: jest.fn(),
} as unknown as jest.Mocked<SearchIndex>;

export const algoliaClientMock = {
  initIndex: jest.fn().mockReturnValue(algoliaIndexMock),
} as unknown as jest.Mocked<SearchClient>;
