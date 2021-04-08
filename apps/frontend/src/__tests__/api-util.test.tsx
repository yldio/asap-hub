import { createListApiUrl } from '../api-util';
import { CARD_VIEW_PAGE_SIZE } from '../hooks';

describe('createListApiUrl', () => {
  it('uses defaults for take and skip params', async () => {
    const url = createListApiUrl('test', {
      pageSize: CARD_VIEW_PAGE_SIZE,
      currentPage: 0,
      searchQuery: '',
      filters: new Set(),
    });
    expect(url.search).toMatchInlineSnapshot(`"?take=10&skip=0"`);
  });
  it('calculates take and skip from params', async () => {
    const url = createListApiUrl('test', {
      currentPage: 2,
      pageSize: 10,
      filters: new Set(),
      searchQuery: '',
    });
    expect(url.searchParams.get('take')).toEqual('10');
    expect(url.searchParams.get('skip')).toEqual('20');
  });

  it('handles requests with a search query', async () => {
    const url = createListApiUrl('test', {
      searchQuery: 'test123',
      filters: new Set(),
      pageSize: CARD_VIEW_PAGE_SIZE,
      currentPage: 0,
    });
    expect(url.searchParams.get('search')).toEqual('test123');
  });
  it('handles requests with filters', async () => {
    const url = createListApiUrl('test', {
      filters: new Set(['123', '456']),
      currentPage: 0,
      pageSize: CARD_VIEW_PAGE_SIZE,
      searchQuery: '',
    });
    expect(url.searchParams.getAll('filter')).toEqual(['123', '456']);
  });
});
