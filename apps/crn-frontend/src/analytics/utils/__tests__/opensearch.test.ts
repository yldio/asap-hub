import { OpensearchClient } from '../opensearch';

const originalFetch = global.fetch;
const mockFetch = jest.fn();

type MockData = {
  teamId: string;
  teamName: string;
  users: { name: string }[];
};

describe('OpensearchClient', () => {
  let client: OpensearchClient<MockData>;

  beforeEach(() => {
    global.fetch = mockFetch;
    client = new OpensearchClient<MockData>('test-index', 'Bearer fake-token');
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns parsed search result', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        hits: {
          total: { value: 2 },
          hits: [
            {
              _id: '1',
              _index: 'test-index',
              _score: 1.0,
              _source: {
                teamId: 'team-id-1',
                teamName: 'Team A',
                users: [],
              },
            },
            {
              _id: '2',
              _index: 'test-index',
              _score: 1.0,
              _source: {
                title: 'team-id-2',
                teamName: 'Team B',
                users: [{ name: 'Test User 1' }],
              },
            },
          ],
        },
      }),
    });

    const result = await client.search(['Team'], 0, 10);

    expect(result.total).toBe(2);
    expect(result.items).toHaveLength(2);
    expect(result.items[0]?.teamName).toBe('Team A');
  });

  it('returns parsed tag suggestions', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        aggregations: {
          matching_teams: {
            teams: {
              buckets: [{ key: 'Jackson', doc_count: 5 }],
            },
          },
          matching_users: {
            filtered_names: {
              names: {
                buckets: [
                  { key: 'Jack Richards', doc_count: 3 },
                  { key: 'Chloe Jackson', doc_count: 2 },
                ],
              },
            },
          },
        },
      }),
    });

    const result = await client.getTagSuggestions('Jack');

    expect(result).toEqual(['Jackson', 'Jack Richards', 'Chloe Jackson']);
  });

  it('throws an error on bad response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(client.search([], 0, 10)).rejects.toThrow(
      'Failed to search os-champion index. Expected status 2xx. Received status 500 Internal Server Error.',
    );
  });
});
