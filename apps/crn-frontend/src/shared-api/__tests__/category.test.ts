import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getCategories } from '../category';

describe('getCategories', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched categories list', async () => {
    const mockResponse = {
      total: 1,
      items: [
        {
          id: '1',
          name: 'Category 1',
        },
      ],
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/categories')
      .query({})
      .reply(200, mockResponse);

    const result = await getCategories({}, 'Bearer x');
    expect(result).toEqual(mockResponse);
  });

  it('returns a successfully fetched categories list with search query', async () => {
    const mockResponse = {
      total: 1,
      items: [
        {
          id: '1',
          name: 'Category 1',
        },
      ],
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/categories')
      .query({ search: 'Mitochondrial Pathways' })
      .reply(200, mockResponse);

    const result = await getCategories(
      { search: 'Mitochondrial Pathways' },
      'Bearer x',
    );
    expect(result).toEqual(mockResponse);
  });

  it('throws for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/categories')
      .query({})
      .reply(500, {});

    await expect(getCategories({}, 'Bearer x')).rejects.toThrow(
      'Failed to fetch the categories. Expected status 2xx. Received status 500.',
    );
  });
});
