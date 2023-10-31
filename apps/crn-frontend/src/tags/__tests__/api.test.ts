import { AlgoliaSearchClient, CRNTagSearchEntities } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';

import nock from 'nock';
import { CARD_VIEW_PAGE_SIZE } from '../../hooks';
import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { getTagSearch } from '../api';

jest.mock('../../config');

afterEach(() => {
  nock.cleanAll();
});

const options: GetListOptions = {
  filters: new Set<string>(),
  pageSize: CARD_VIEW_PAGE_SIZE,
  currentPage: 0,
  searchQuery: '',
};

describe('getTagSearch', () => {
  const entityTypes: CRNTagSearchEntities[] = ['research-output', 'user'];

  const mockAlgoliaSearchClient = {
    search: jest
      .fn()
      .mockResolvedValue(createResearchOutputListAlgoliaResponse(1)),
  } as unknown as jest.Mocked<AlgoliaSearchClient<'crn'>>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes a search request with query, default page and page size', async () => {
    await getTagSearch(mockAlgoliaSearchClient, entityTypes, {
      ...options,
      searchQuery: 'test',
      currentPage: null,
      pageSize: null,
      tags: [],
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      entityTypes,
      'test',
      expect.objectContaining({ hitsPerPage: 10, page: 0 }),
    );
  });

  it('passes page number, page size and tags to request', async () => {
    await getTagSearch(mockAlgoliaSearchClient, entityTypes, {
      ...options,
      currentPage: 1,
      pageSize: 20,
      tags: ['Blood', 'Cas9'],
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenLastCalledWith(
      entityTypes,
      '',
      expect.objectContaining({ hitsPerPage: 20, page: 1 }),
    );
  });
});
