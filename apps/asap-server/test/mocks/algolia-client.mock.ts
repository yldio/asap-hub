import { SearchClient, SearchIndex } from 'algoliasearch';

export const algoliaIndexMock = {
  saveObject: jest.fn(),
} as unknown as jest.Mocked<SearchIndex>;

export const algoliaClientMock = {
  initIndex: jest.fn().mockReturnValue(algoliaIndexMock),
} as unknown as jest.Mocked<SearchClient>;
