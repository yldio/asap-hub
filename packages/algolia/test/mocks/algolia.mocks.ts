import { SearchClient, SearchIndex } from 'algoliasearch';

export const getAlgoliaSearchIndexMock = (): jest.Mocked<SearchIndex> =>
  ({
    saveObject: jest.fn(),
    deleteObject: jest.fn(),
    search: jest.fn(),
  } as unknown as jest.Mocked<SearchIndex>);
