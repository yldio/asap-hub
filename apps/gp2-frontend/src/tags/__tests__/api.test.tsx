import { AlgoliaSearchClient } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { PAGE_SIZE } from '../../hooks';
import { getTagSearchResults } from '../api';

describe('getTagSearchResults', () => {
  const mockAlgoliaSearchClient = {
    search: jest.fn(),
    catch: jest.fn(),
  } as unknown as jest.Mocked<AlgoliaSearchClient<'gp2'>>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockAlgoliaSearchClient.search = jest.fn().mockResolvedValue({});
  });

  const options: GetListOptions = {
    filters: new Set<string>(),
    pageSize: PAGE_SIZE,
    currentPage: 0,
    searchQuery: '',
  };

  it('makes a search request with query, default page and page size', async () => {
    await getTagSearchResults(mockAlgoliaSearchClient, {
      ...options,
      searchQuery: 'test',
      currentPage: null,
      pageSize: null,
    });

    expect(mockAlgoliaSearchClient.search).toHaveBeenCalledWith(
      ['event', 'news', 'output', 'project', 'user'],
      'test',
      expect.objectContaining({ hitsPerPage: 10, page: 0 }),
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
});
