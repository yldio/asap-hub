import nock from 'nock';
import { API_BASE_URL } from '../../config';
import { getImpacts } from '../impact';

describe('getImpacts', () => {
  afterEach(() => {
    expect(nock.isDone()).toBe(true);
    nock.cleanAll();
  });

  it('returns a successfully fetched impacts list', async () => {
    const mockResponse = {
      total: 1,
      items: [
        {
          id: '1',
          name: 'Impact 1',
        },
      ],
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/impact')
      .query({})
      .reply(200, mockResponse);

    const result = await getImpacts({}, 'Bearer x');
    expect(result).toEqual(mockResponse);
  });

  it('returns a successfully fetched impacts list with search query', async () => {
    const mockResponse = {
      total: 1,
      items: [
        {
          id: '1',
          name: 'Impact 1',
        },
      ],
    };
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/impact')
      .query({ search: 'general discovery' })
      .reply(200, mockResponse);

    const result = await getImpacts(
      { search: 'general discovery' },
      'Bearer x',
    );
    expect(result).toEqual(mockResponse);
  });

  it('throws for error status', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .get('/impact')
      .query({})
      .reply(500, {});

    await expect(getImpacts({}, 'Bearer x')).rejects.toThrow(
      'Failed to fetch the impacts. Expected status 2xx. Received status 500.',
    );
  });
});
