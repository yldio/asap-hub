import { createListApiUrl } from '../api-util';

describe('createListApiUrl', () => {
  it('handles requests without parameters', async () => {
    expect(
      createListApiUrl('test', {
        pageSize: null,
        currentPage: null,
      }).toString(),
    ).toMatch(/\/test$/);
  });

  it('sets default page and size', async () => {
    const url = createListApiUrl('test');
    expect(url.searchParams.get('take')).toEqual('10');
    expect(url.searchParams.get('skip')).toEqual('0');
  });

  it('calculates take and skip from params', async () => {
    const url = createListApiUrl('test', { currentPage: 2, pageSize: 10 });
    expect(url.searchParams.get('take')).toEqual('10');
    expect(url.searchParams.get('skip')).toEqual('20');
  });

  it('handles requests with a search query', async () => {
    const url = createListApiUrl('test', { searchQuery: 'test123' });
    expect(url.searchParams.get('search')).toEqual('test123');
  });
  it('handles requests with filters', async () => {
    const url = createListApiUrl('test', { filters: ['123', '456'] });
    expect(url.searchParams.getAll('filter')).toEqual(['123', '456']);
  });

  it('handles requests with sort parameters', async () => {
    const url = createListApiUrl('test', {
      sort: { sortBy: 'name', sortOrder: 'asc' },
    });
    expect(url.searchParams.get('sortBy')).toEqual('name');
    expect(url.searchParams.get('sortOrder')).toEqual('asc');
  });
});
