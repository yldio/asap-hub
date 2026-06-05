import { SearchClient } from 'algoliasearch';

export const getAlgoliaSearchIndexMock = (): jest.Mocked<
  Pick<
    SearchClient,
    | 'saveObject'
    | 'saveObjects'
    | 'deleteObject'
    | 'searchSingleIndex'
    | 'searchForFacetValues'
  >
> =>
  ({
    saveObject: jest.fn(),
    saveObjects: jest.fn(),
    deleteObject: jest.fn(),
    searchSingleIndex: jest.fn(),
    searchForFacetValues: jest.fn(),
  }) as unknown as jest.Mocked<
    Pick<
      SearchClient,
      | 'saveObject'
      | 'saveObjects'
      | 'deleteObject'
      | 'searchSingleIndex'
      | 'searchForFacetValues'
    >
  >;
