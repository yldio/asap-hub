import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { PAGE_SIZE } from '../../hooks';
import { getTagSearchResults, TagSearchOptions } from '../api';

describe('getTagSearchResults', () => {
  const mockAlgoliaSearchClient = {
    search: jest.fn(),
    catch: jest.fn(),
  } as unknown as jest.Mocked<AlgoliaSearchClient<'gp2'>>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockAlgoliaSearchClient.search = jest.fn().mockResolvedValue({});
  });

  const options: TagSearchOptions = {
    entityType: new Set(),
    pageSize: PAGE_SIZE,
    currentPage: 0,
    tags: [],
  };

  it('makes a search request with query, no filter set, default page and page size', async () => {
    await getTagSearchResults(mockAlgoliaSearchClient, {
      ...options,
      tags: ['test'],
      currentPage: null,
      pageSize: null,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenCalledWith(
      ['event', 'news', 'output', 'project', 'user'],
      '',
      expect.objectContaining({
        hitsPerPage: 10,
        page: 0,
        tagFilters: ['test'],
      }),
    );
  });

  it('throws an error of type error', async () => {
    mockAlgoliaSearchClient.search.mockRejectedValue({
      message: 'Some Error',
    });
    await expect(
      getTagSearchResults(mockAlgoliaSearchClient, options),
    ).rejects.toMatchInlineSnapshot(`[Error: Could not search: Some Error]`);
  });

  it('handle filtering', async () => {
    await getTagSearchResults(mockAlgoliaSearchClient, {
      ...options,
      entityType: new Set(['event']),
      tags: ['test'],
      currentPage: null,
      pageSize: null,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenCalledWith(
      ['event'],
      '',
      expect.objectContaining({
        hitsPerPage: 10,
        page: 0,
        tagFilters: ['test'],
      }),
    );
  });
});
