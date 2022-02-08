import { SearchClient, SearchIndex } from 'algoliasearch';

export const getAlgoliaSearchIndexMock = (): jest.Mocked<SearchIndex> =>
  ({
    batch: jest.fn(),
    saveObject: jest.fn(),
    deleteObject: jest.fn(),
    search: jest.fn(),
  } as unknown as jest.Mocked<SearchIndex>);
